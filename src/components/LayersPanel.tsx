import type { ReportCategory } from '../types/database'
import { CATEGORY_CONFIG } from '../lib/categoryConfig'
import { Modal } from './Modal'

interface LayersPanelProps {
  visibleCategories: Set<ReportCategory>
  heatmapEnabled: boolean
  isAllVisible: boolean
  onToggleCategory: (category: ReportCategory) => void
  onToggleHeatmap: () => void
  onShowAll: () => void
  onHideAll: () => void
  onClose: () => void
}

const CATEGORY_ORDER: ReportCategory[] = [
  'personas_atrapadas',
  'heridos',
  'solicitud_ayuda',
  'incendios',
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

export function LayersPanel({
  visibleCategories,
  heatmapEnabled,
  isAllVisible,
  onToggleCategory,
  onToggleHeatmap,
  onShowAll,
  onHideAll,
  onClose,
}: LayersPanelProps) {
  return (
    <Modal title="Capas del mapa" onClose={onClose}>
      <div className="space-y-6">

        {/* HEATMAP (PRIORIDAD VISUAL REAL) */}
        <button
          type="button"
          onClick={onToggleHeatmap}
          className={`
            w-full
            flex items-center justify-between
            p-4

            rounded-xl
            border

            transition

            ${heatmapEnabled
              ? 'border-[#C62828] bg-[#C62828]/10'
              : 'border-neutral-200 bg-white'}
          `}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>

            <div className="text-left">
              <p className="font-semibold text-sm text-neutral-900">
                Mapa de calor activo
              </p>
              <p className="text-xs text-neutral-500 leading-tight">
                Detecta zonas con mayor concentración de riesgo en tiempo real
              </p>
            </div>
          </div>

          <Toggle checked={heatmapEnabled} />
        </button>

        {/* ACCIONES GLOBALES */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onShowAll}
            disabled={isAllVisible}
            className="
              flex-1
              py-2.5

              rounded-md

              text-sm font-medium

              border border-neutral-200
              bg-white

              disabled:opacity-40
            "
          >
            Activar todo
          </button>

          <button
            type="button"
            onClick={onHideAll}
            disabled={visibleCategories.size === 0}
            className="
              flex-1
              py-2.5

              rounded-md

              text-sm font-medium

              border border-neutral-200
              bg-white

              disabled:opacity-40
            "
          >
            Desactivar todo
          </button>
        </div>

        {/* CATEGORÍAS */}
        <div className="space-y-2">
          {CATEGORY_ORDER.map((category) => {
            const config = CATEGORY_CONFIG[category]
            const isVisible = visibleCategories.has(category)

            return (
              <button
                key={category}
                type="button"
                onClick={() => onToggleCategory(category)}
                className="
                  w-full

                  flex items-center gap-3

                  p-3

                  rounded-lg

                  transition

                  hover:bg-neutral-50
                "
              >
                <span
                  className="h-8 w-8 rounded-md flex items-center justify-center text-base flex-shrink-0"
                  style={{
                    backgroundColor: config.color,
                    opacity: isVisible ? 1 : 0.25,
                  }}
                >
                  {config.emoji}
                </span>

                <span
                  className={`
                    flex-1 text-left text-sm font-medium

                    ${isVisible
                      ? 'text-neutral-900'
                      : 'text-neutral-400'}
                  `}
                >
                  {config.label}
                </span>

                <Toggle checked={isVisible} />
              </button>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}

function Toggle({ checked }: { checked: boolean }) {
  return (
    <span
      className={`
        flex-shrink-0 inline-flex h-6 w-11 items-center

        rounded-full

        transition-colors

        ${checked ? 'bg-[#0B3A6E]' : 'bg-neutral-300'}
      `}
    >
      <span
        className={`
          inline-block h-5 w-5

          rounded-full

          bg-white
          shadow

          transition-transform

          ${checked ? 'translate-x-5' : 'translate-x-0.5'}
        `}
      />
    </span>
  )
}
