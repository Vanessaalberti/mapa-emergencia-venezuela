-- ============================================================
-- MIGRACIÓN: Eliminar categoría 'inundaciones'
-- ============================================================
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query
--
-- Este script:
-- 1. Reasigna a 'otros' cualquier reporte existente con category = 'inundaciones'
--    (por seguridad, en caso de que ya hayas creado alguno)
-- 2. Recrea el constraint CHECK de la columna `category` sin 'inundaciones'
-- ============================================================

-- Paso 1: reasignar reportes existentes (si los hay) para no perder datos
update public.reports
set category = 'otros'
where category = 'inundaciones';

-- Paso 2: quitar el constraint viejo
alter table public.reports
  drop constraint if exists reports_category_check;

-- Paso 3: crear el constraint nuevo, sin 'inundaciones'
alter table public.reports
  add constraint reports_category_check
  check (category in (
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
  ));
