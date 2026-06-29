-- ============================================================
-- MIGRACIÓN: Perfiles y roles
-- ============================================================
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- ------------------------------------------------------------
-- Tabla: profiles (1 a 1 con auth.users, agrega rol y datos públicos)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'usuario' check (role in (
    'visitante',   -- no aplica como fila (sin cuenta); incluido por completitud
    'usuario',
    'voluntario',
    'moderador',
    'administrador'
  )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Datos de perfil y rol de cada usuario autenticado';

-- ------------------------------------------------------------
-- Trigger: crear automáticamente un profile cuando alguien se registra
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'usuario'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Mantener updated_at actualizado (reutiliza la función ya creada en schema.sql)
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Función auxiliar: obtener el rol del usuario autenticado actual
-- (se usa en las políticas RLS de abajo y de futuras tablas)
-- ------------------------------------------------------------
create or replace function public.current_user_role()
returns text as $$
  select role from public.profiles where id = auth.uid();
$$ language sql stable security definer;

-- ------------------------------------------------------------
-- RLS de profiles
-- ------------------------------------------------------------
alter table public.profiles enable row level security;

-- Cualquiera puede ver perfiles públicos básicos (nombre, rol) — útil para
-- mostrar quién reportó o moderó algo.
create policy "profiles_select_all"
  on public.profiles for select
  using (true);

-- Cada usuario puede actualizar su propio nombre, pero NO su propio rol
-- (eso requeriría un admin). Se valida con un trigger adicional abajo.
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Los administradores pueden actualizar cualquier perfil (incluido el rol)
create policy "profiles_update_admin"
  on public.profiles for update
  using (public.current_user_role() = 'administrador');

-- ------------------------------------------------------------
-- Trigger de seguridad: evitar que un usuario normal se auto-asigne un rol
-- distinto al que ya tenía, salvo que quien ejecuta el update sea admin.
-- ------------------------------------------------------------
create or replace function public.prevent_self_role_escalation()
returns trigger as $$
begin
  if new.role is distinct from old.role and public.current_user_role() is distinct from 'administrador' then
    new.role := old.role;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_prevent_self_role_escalation on public.profiles;
create trigger trg_prevent_self_role_escalation
  before update on public.profiles
  for each row
  execute function public.prevent_self_role_escalation();

-- ------------------------------------------------------------
-- Actualizar políticas de reports para tener en cuenta roles
-- ------------------------------------------------------------

-- Moderadores y administradores pueden editar y archivar cualquier reporte,
-- no solo los propios (se suma a la política "reports_update_own" ya existente).
create policy "reports_update_moderation"
  on public.reports for update
  using (public.current_user_role() in ('moderador', 'administrador'));

-- Moderadores y administradores pueden eliminar reportes (ej: spam, duplicados)
create policy "reports_delete_moderation"
  on public.reports for delete
  using (public.current_user_role() in ('moderador', 'administrador'));

-- Habilitar Realtime en profiles, para que cambios de rol se reflejen sin recargar
alter publication supabase_realtime add table public.profiles;
