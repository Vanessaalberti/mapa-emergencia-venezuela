-- ============================================================
-- MAPA DE EMERGENCIA VENEZUELA — Esquema Fase 1 (Mapa + Feed)
-- ============================================================
-- Ejecutar este archivo completo en: Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- Extensión necesaria para generar UUIDs
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Tabla principal: reports (reportes/marcadores del mapa)
-- ------------------------------------------------------------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),

  -- Ubicación
  latitude double precision not null,
  longitude double precision not null,
  address text,

  -- Contenido
  category text not null check (category in (
    'personas_atrapadas',
    'heridos',
    'hospitales',
    'refugios',
    'centros_donacion',
    'alimentos',
    'agua',
    'medicamentos',
    'electricidad',
    'internet',
    'starlink',
    'calles_bloqueadas',
    'edificios_colapsados',
    'incendios',
    'helipuertos',
    'bomberos',
    'policia',
    'proteccion_civil',
    'equipos_rescate',
    'voluntarios',
    'animales_rescatados',
    'zonas_peligrosas',
    'solicitud_ayuda',
    'otros'
  )),
  title text not null,
  description text,

  -- Estado y prioridad
  status text not null default 'sin_verificar' check (status in (
    'sin_verificar',
    'verificado',
    'en_proceso',
    'equipo_asignado',
    'atendido',
    'resuelto',
    'archivado'
  )),
  priority text not null default 'media' check (priority in (
    'critica', 'alta', 'media', 'baja'
  )),

  -- Datos adicionales
  people_count integer,
  contact_info text,

  -- Métricas
  confirmations_count integer not null default 0,

  -- Metadata
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.reports is 'Reportes/incidentes geolocalizados mostrados como marcadores en el mapa';

-- Índices para acelerar las consultas más comunes
create index if not exists idx_reports_category on public.reports (category);
create index if not exists idx_reports_status on public.reports (status);
create index if not exists idx_reports_priority on public.reports (priority);
create index if not exists idx_reports_created_at on public.reports (created_at desc);
-- Índice espacial básico (lat/lng) para futuras búsquedas por cercanía
create index if not exists idx_reports_lat_lng on public.reports (latitude, longitude);

-- ------------------------------------------------------------
-- Tabla: report_media (fotos/videos/audio de cada reporte)
-- ------------------------------------------------------------
create table if not exists public.report_media (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  media_type text not null check (media_type in ('image', 'video', 'audio')),
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_report_media_report_id on public.report_media (report_id);

-- ------------------------------------------------------------
-- Tabla: comments (comentarios sobre un reporte)
-- ------------------------------------------------------------
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_comments_report_id on public.comments (report_id);

-- ------------------------------------------------------------
-- Tabla: confirmations (quién confirmó un reporte, evita duplicados)
-- ------------------------------------------------------------
create table if not exists public.confirmations (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (report_id, user_id)
);

-- ------------------------------------------------------------
-- Trigger: mantener updated_at actualizado automáticamente
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_reports_updated_at on public.reports;
create trigger trg_reports_updated_at
  before update on public.reports
  for each row
  execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Trigger: recalcular confirmations_count automáticamente
-- ------------------------------------------------------------
create or replace function public.update_confirmations_count()
returns trigger as $$
begin
  update public.reports
  set confirmations_count = (
    select count(*) from public.confirmations where report_id = coalesce(new.report_id, old.report_id)
  )
  where id = coalesce(new.report_id, old.report_id);
  return null;
end;
$$ language plpgsql;

drop trigger if exists trg_confirmations_count on public.confirmations;
create trigger trg_confirmations_count
  after insert or delete on public.confirmations
  for each row
  execute function public.update_confirmations_count();

-- ------------------------------------------------------------
-- Row Level Security (RLS)
-- ------------------------------------------------------------
alter table public.reports enable row level security;
alter table public.report_media enable row level security;
alter table public.comments enable row level security;
alter table public.confirmations enable row level security;

-- Cualquiera (incluso sin login) puede VER los reportes.
-- Esto es clave: en una emergencia, la info debe ser pública y visible sin fricción.
create policy "reports_select_all"
  on public.reports for select
  using (true);

-- Cualquiera puede CREAR un reporte (incluso anónimo), para minimizar fricción.
-- En fases posteriores esto se ajustará con rate limiting / moderación.
create policy "reports_insert_all"
  on public.reports for insert
  with check (true);

-- Solo el creador puede editar su propio reporte (por ahora; luego se sumarán moderadores/admins)
create policy "reports_update_own"
  on public.reports for update
  using (auth.uid() = created_by);

create policy "media_select_all"
  on public.report_media for select
  using (true);

create policy "media_insert_all"
  on public.report_media for insert
  with check (true);

create policy "comments_select_all"
  on public.comments for select
  using (true);

create policy "comments_insert_authenticated"
  on public.comments for insert
  with check (auth.uid() is not null);

create policy "confirmations_select_all"
  on public.confirmations for select
  using (true);

create policy "confirmations_insert_authenticated"
  on public.confirmations for insert
  with check (auth.uid() = user_id);

create policy "confirmations_delete_own"
  on public.confirmations for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Habilitar Realtime en la tabla reports
-- (esto permite que el mapa/feed se actualicen sin recargar la página)
-- ------------------------------------------------------------
alter publication supabase_realtime add table public.reports;
alter publication supabase_realtime add table public.comments;
alter publication supabase_realtime add table public.confirmations;
