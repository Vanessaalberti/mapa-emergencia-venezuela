import type { Database as GeneratedDatabase } from './database.types'

export type { Database } from './database.types'

// ── Tipos de dominio ─────────────────────────────────────────────────────────

export type UserRole =
  | 'visitante'
  | 'usuario'
  | 'voluntario'
  | 'moderador'
  | 'administrador'

export type ReportStatus =
  | 'sin_verificar'
  | 'verificado'
  | 'en_proceso'
  | 'equipo_asignado'
  | 'atendido'
  | 'resuelto'
  | 'archivado'

export type ReportPriority = 'critica' | 'alta' | 'media' | 'baja'

export type ReportCategory =
  | 'personas_atrapadas'
  | 'heridos'
  | 'hospitales'
  | 'refugios'
  | 'centros_donacion'
  | 'alimentos'
  | 'agua'
  | 'medicamentos'
  | 'electricidad'
  | 'internet'
  | 'starlink'
  | 'calles_bloqueadas'
  | 'edificios_colapsados'
  | 'incendios'
  | 'inundaciones'
  | 'helipuertos'
  | 'bomberos'
  | 'policia'
  | 'proteccion_civil'
  | 'equipos_rescate'
  | 'voluntarios'
  | 'animales_rescatados'
  | 'zonas_peligrosas'
  | 'solicitud_ayuda'
  | 'otros'

// ── Tipos derivados de la DB generada ────────────────────────────────────────
// El archivo generado usa `string` para columnas text de Postgres.
// Acá sobreescribimos esos campos con nuestros union types específicos
// para que el resto del código (CATEGORY_CONFIG, STATUS_CONFIG, etc.)
// reciba tipos correctos sin tener que hacer casts en cada componente.

type RawReport = GeneratedDatabase['public']['Tables']['reports']['Row']
type RawReportInsert = GeneratedDatabase['public']['Tables']['reports']['Insert']
type RawProfile = GeneratedDatabase['public']['Tables']['profiles']['Row']

export type Report = Omit<RawReport, 'category' | 'status' | 'priority'> & {
  category: ReportCategory
  status: ReportStatus
  priority: ReportPriority
}

export type ReportInsert = Omit<RawReportInsert, 'category' | 'status' | 'priority'> & {
  category: ReportCategory
  status?: ReportStatus
  priority?: ReportPriority
}

export type ReportUpdate = Partial<ReportInsert>

export type Profile = Omit<RawProfile, 'role'> & {
  role: UserRole
}