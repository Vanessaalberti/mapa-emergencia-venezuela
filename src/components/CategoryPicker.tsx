import type { ReportCategory } from '../types/database'
import { CATEGORY_CONFIG } from '../lib/categoryConfig'

interface CategoryPickerProps {
  value: ReportCategory | null
  onChange: (category: ReportCategory) => void
}

const CATEGORY_ORDER: ReportCategory[] = [
  'personas_atrapadas',
  'heridos',
  'solicitud_ayuda',
  'incendios',
  'inundaciones',
  'edificios_colapsados',
  'zonas_peligrosas',
  'calles_bloqueadas',
  'hospitales',
  'refugios',
  'alimentos',
  'agua',
  'medicamentos',
  'electricidad',
  'internet',
  'starlink',
  'centros_donacion',
  'helipuertos',
  'bomberos',
  'policia',
  'proteccion_civil',
  'equipos_rescate',
  'voluntarios',
  'animales_rescatados',
  'otros',
]

export function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {CATEGORY_ORDER.map((category) => {
        const config = CATEGORY_CONFIG[category]
        const isSelected = value === category

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-colors ${
              isSelected
                ? 'border-info bg-info/10'
                : 'border-border'
            }`}
          >
            <span
              className="h-10 w-10 rounded-full flex items-center justify-center text-xl"
              style={{ backgroundColor: config.color }}
            >
              {config.emoji}
            </span>
            <span className="text-xs font-medium text-center leading-tight text-ink-primary">
              {config.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
