-- ============================================================
-- MIGRACIÓN: Ayuda desde el extranjero
-- ============================================================
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query
--
-- Tabla para centros de acopio, canales oficiales de donación, y
-- jornadas de recolección organizadas por venezolanos (o aliados)
-- en otros países. Es información completamente separada de los
-- reportes de emergencia geolocalizados dentro de Venezuela.
-- ============================================================

create table if not exists public.foreign_aid_centers (
  id uuid primary key default gen_random_uuid(),

  -- Ubicación (a nivel de país/ciudad, no coordenadas exactas — no usa mapa)
  country text not null,
  city text not null,

  -- Contenido
  title text not null,
  description text,
  address text,

  -- Horarios de recepción de donaciones (texto libre, ej: "Lunes a viernes, 9am-6pm")
  schedule text,

  -- Fechas específicas de jornadas, si aplica (ej: "15 y 16 de julio")
  collection_dates text,

  -- Tipo de ayuda que se puede aportar acá
  accepts_physical_donations boolean not null default true,
  accepts_monetary_donations boolean not null default false,

  -- Canal oficial de donación monetaria (ej: link a una cuenta, GoFundMe, etc.)
  donation_link text,

  -- Contacto
  contact_info text,

  -- Moderación: solo usuarios logueados pueden crear, y se marca como
  -- "verificado" por un moderador/admin antes de destacarse como confiable.
  verified boolean not null default false,

  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.foreign_aid_centers is
  'Centros de acopio, jornadas de donación y canales oficiales organizados desde el extranjero';

create index if not exists idx_foreign_aid_country on public.foreign_aid_centers (country);
create index if not exists idx_foreign_aid_created_at on public.foreign_aid_centers (created_at desc);

-- Reutilizamos la función set_updated_at ya creada en schema.sql
drop trigger if exists trg_foreign_aid_updated_at on public.foreign_aid_centers;
create trigger trg_foreign_aid_updated_at
  before update on public.foreign_aid_centers
  for each row
  execute function public.set_updated_at();

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------
alter table public.foreign_aid_centers enable row level security;

-- Cualquiera puede ver la lista, incluso sin cuenta
create policy "foreign_aid_select_all"
  on public.foreign_aid_centers for select
  using (true);

-- Solo usuarios logueados pueden crear
create policy "foreign_aid_insert_authenticated"
  on public.foreign_aid_centers for insert
  with check (auth.uid() is not null and auth.uid() = created_by);

-- El creador puede editar/eliminar su propia publicación
create policy "foreign_aid_update_own"
  on public.foreign_aid_centers for update
  using (auth.uid() = created_by);

create policy "foreign_aid_delete_own"
  on public.foreign_aid_centers for delete
  using (auth.uid() = created_by);

-- Moderadores/administradores pueden editar (ej: marcar como verificado)
-- o eliminar cualquier publicación (ej: spam, información falsa)
create policy "foreign_aid_update_moderation"
  on public.foreign_aid_centers for update
  using (public.current_user_role() in ('moderador', 'administrador'));

create policy "foreign_aid_delete_moderation"
  on public.foreign_aid_centers for delete
  using (public.current_user_role() in ('moderador', 'administrador'));

-- Tiempo real
alter publication supabase_realtime add table public.foreign_aid_centers;
