export type UserRole = 'visitante' | 'usuario' | 'voluntario' | 'moderador' | 'administrador'

export interface Profile {
  id: string
  display_name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

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

export type ReportStatus =
  | 'sin_verificar'
  | 'verificado'
  | 'en_proceso'
  | 'equipo_asignado'
  | 'atendido'
  | 'resuelto'
  | 'archivado'

export type ReportPriority = 'critica' | 'alta' | 'media' | 'baja'

export interface Report {
  id: string
  latitude: number
  longitude: number
  address: string | null
  category: ReportCategory
  title: string
  description: string | null
  status: ReportStatus
  priority: ReportPriority
  people_count: number | null
  contact_info: string | null
  confirmations_count: number
  created_by: string | null
  created_at: string
  updated_at: string
}

export type ReportInsert = Omit<
  Report,
  'id' | 'confirmations_count' | 'created_at' | 'updated_at'
>

// Tipo mínimo de Database para que supabase-js infiera tipos en las queries.
// Se irá ampliando en próximas fases (comments, report_media, etc).
export interface Database {
  public: {
    Tables: {
      reports: {
        Row: Report
        Insert: ReportInsert
        Update: Partial<ReportInsert>
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Pick<Profile, 'display_name' | 'role'>>
      }
    }
  }
}
