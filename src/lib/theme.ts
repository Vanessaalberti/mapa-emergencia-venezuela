/**
 * Sistema de diseño — Mapa de Emergencia Venezuela
 *
 * Cada color tiene un significado funcional, no decorativo.
 * Ver documento de especificación: "Paleta de colores y sistema visual".
 */

export const COLORS = {
  // Fondo y superficie
  backgroundPrimary: '#F8FAFC',
  backgroundSecondary: '#EEF2F6',

  // Texto
  textPrimary: '#1E293B',
  textSecondary: '#64748B',

  // Bordes
  border: '#CBD5E1',

  // Colores funcionales
  critical: '#DC2626', // Emergencia crítica — uso exclusivo, nunca decorativo
  warning: '#F59E0B', // Sin verificar / riesgos / zonas peligrosas
  info: '#2563EB', // Información oficial / institucional
  success: '#16A34A', // Resuelto / rescatado / disponible
  connectivity: '#06B6D4', // Starlink / internet — diferenciado del azul institucional
  donation: '#7C3AED', // Donaciones / voluntariado
  water: '#0EA5E9', // Agua potable
  food: '#F97316', // Alimentos
  electricity: '#EAB308', // Electricidad / generadores

  // Botones
  buttonPrimary: '#2563EB',
  buttonPrimaryHover: '#1D4ED8',
} as const

export const STATUS_COLOR = {
  sin_verificar: '#F59E0B',
  verificado: '#16A34A',
  en_proceso: '#F97316',
  equipo_asignado: '#2563EB',
  atendido: '#2563EB',
  resuelto: '#15803D',
  archivado: '#94A3B8',
} as const

export const PRIORITY_COLOR = {
  critica: '#DC2626',
  alta: '#EA580C',
  media: '#EAB308',
  baja: '#16A34A',
} as const
