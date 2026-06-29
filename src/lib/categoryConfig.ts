import type { ReportCategory, ReportPriority, ReportStatus } from '../types/database'
import { COLORS, STATUS_COLOR, PRIORITY_COLOR } from './theme'

interface CategoryConfig {
  label: string
  emoji: string
  color: string // color hex usado en marcador y badges — significado funcional, no decorativo
}

/**
 * Color por categoría, siguiendo el sistema visual funcional:
 * - Rojo (#DC2626): exclusivo para emergencias críticas reales
 * - Naranja (#EA580C / #F97316): heridos, alimentos, prioridad alta
 * - Amarillo (#FACC15 / #EAB308): advertencia, zonas peligrosas, electricidad
 * - Azul (#2563EB): información oficial, institucional, hospitales
 * - Verde (#16A34A): éxito, refugios operativos, voluntariado
 * - Celeste (#06B6D4): conectividad (Starlink, internet) — diferenciado del azul institucional
 * - Violeta (#7C3AED): donaciones, centros de acopio
 * - Café (#92400E): edificios colapsados
 * - Gris pizarra (#334155): calles bloqueadas
 * - Celeste agua (#0EA5E9): agua potable
 */
export const CATEGORY_CONFIG: Record<ReportCategory, CategoryConfig> = {
  personas_atrapadas: { label: 'Personas atrapadas', emoji: '🆘', color: COLORS.critical },
  heridos: { label: 'Heridos', emoji: '🚑', color: '#EA580C' },
  hospitales: { label: 'Hospitales', emoji: '🏥', color: COLORS.info },
  refugios: { label: 'Refugios', emoji: '🏠', color: COLORS.success },
  centros_donacion: { label: 'Centros de donación', emoji: '📦', color: COLORS.donation },
  alimentos: { label: 'Alimentos', emoji: '🍞', color: COLORS.food },
  agua: { label: 'Agua', emoji: '💧', color: COLORS.water },
  medicamentos: { label: 'Medicamentos', emoji: '💊', color: COLORS.info },
  electricidad: { label: 'Electricidad', emoji: '⚡', color: COLORS.electricity },
  internet: { label: 'Internet', emoji: '📶', color: COLORS.connectivity },
  starlink: { label: 'Antenas Starlink', emoji: '📡', color: COLORS.connectivity },
  calles_bloqueadas: { label: 'Calles bloqueadas', emoji: '🚧', color: '#334155' },
  edificios_colapsados: { label: 'Edificios colapsados', emoji: '🏚️', color: '#92400E' },
  incendios: { label: 'Incendios', emoji: '🔥', color: COLORS.critical },
  inundaciones: { label: 'Inundaciones', emoji: '🌊', color: COLORS.water },
  helipuertos: { label: 'Helipuertos', emoji: '🚁', color: COLORS.info },
  bomberos: { label: 'Bomberos', emoji: '🚒', color: COLORS.critical },
  policia: { label: 'Policía', emoji: '🚓', color: COLORS.info },
  proteccion_civil: { label: 'Protección Civil', emoji: '⛑', color: COLORS.info },
  equipos_rescate: { label: 'Equipos de rescate', emoji: '👥', color: '#EA580C' },
  voluntarios: { label: 'Voluntarios', emoji: '🙋', color: COLORS.donation },
  animales_rescatados: { label: 'Animales rescatados', emoji: '🐶', color: COLORS.success },
  zonas_peligrosas: { label: 'Zonas peligrosas', emoji: '⚠', color: '#FACC15' },
  solicitud_ayuda: { label: 'Solicitudes de ayuda', emoji: '📢', color: COLORS.critical },
  otros: { label: 'Otros', emoji: '📍', color: COLORS.textSecondary },
}

export const STATUS_LABEL: Record<ReportStatus, string> = {
  sin_verificar: 'Sin verificar',
  verificado: 'Verificado',
  en_proceso: 'En proceso',
  equipo_asignado: 'Equipo asignado',
  atendido: 'Atendido',
  resuelto: 'Resuelto',
  archivado: 'Archivado',
}

export const STATUS_CONFIG: Record<ReportStatus, { label: string; color: string }> = {
  sin_verificar: { label: 'Sin verificar', color: STATUS_COLOR.sin_verificar },
  verificado: { label: 'Verificado', color: STATUS_COLOR.verificado },
  en_proceso: { label: 'En proceso', color: STATUS_COLOR.en_proceso },
  equipo_asignado: { label: 'Equipo asignado', color: STATUS_COLOR.equipo_asignado },
  atendido: { label: 'Atendido', color: STATUS_COLOR.atendido },
  resuelto: { label: 'Resuelto', color: STATUS_COLOR.resuelto },
  archivado: { label: 'Archivado', color: STATUS_COLOR.archivado },
}

export const PRIORITY_CONFIG: Record<ReportPriority, { label: string; color: string }> = {
  critica: { label: 'Crítica', color: PRIORITY_COLOR.critica },
  alta: { label: 'Alta', color: PRIORITY_COLOR.alta },
  media: { label: 'Media', color: PRIORITY_COLOR.media },
  baja: { label: 'Baja', color: PRIORITY_COLOR.baja },
}

/**
 * Categorías consideradas de urgencia inmediata. El heatmap muestra
 * densidad únicamente de estas categorías, para no diluir la señal
 * con reportes de baja urgencia (ej: centros de donación, voluntarios).
 */
export const URGENT_HEATMAP_CATEGORIES: ReportCategory[] = [
  'personas_atrapadas',
  'heridos',
  'incendios',
  'zonas_peligrosas',
  'solicitud_ayuda',
  'edificios_colapsados',
]
