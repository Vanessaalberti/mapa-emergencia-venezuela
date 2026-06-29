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
      <div className="space-y-5">
        {/* Heatmap */}
        <button
          type="button"
          onClick={onToggleHeatmap}
          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 ${
            heatmapEnabled
              ? 'border-critical bg-critical/10'
              : 'border-border'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div className="text-left">
              <p className="font-semibold text-sm text-ink-primary">
                Mapa de calor — zonas críticas
              </p>
              <p className="text-xs text-ink-secondary">
                Densidad de personas atrapadas, heridos, incendios y zonas peligrosas
              </p>
            </div>
          </div>
          <Toggle checked={heatmapEnabled} />
        </button>

        {/* Mostrar/ocultar todo */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onShowAll}
            disabled={isAllVisible}
            className="flex-1 py-2 rounded-lg text-sm font-semibold border border-border disabled:opacity-40"
          >
            Mostrar todas
          </button>
          <button
            type="button"
            onClick={onHideAll}
            disabled={visibleCategories.size === 0}
            className="flex-1 py-2 rounded-lg text-sm font-semibold border border-border disabled:opacity-40"
          >
            Ocultar todas
          </button>
        </div>

        {/* Lista de categorías */}
        <div className="space-y-1">
          {CATEGORY_ORDER.map((category) => {
            const config = CATEGORY_CONFIG[category]
            const isVisible = visibleCategories.has(category)

            return (
              <button
                key={category}
                type="button"
                onClick={() => onToggleCategory(category)}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-bg-secondary"
              >
                <span
                  className="h-8 w-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
                  style={{ backgroundColor: config.color, opacity: isVisible ? 1 : 0.3 }}
                >
                  {config.emoji}
                </span>
                <span
                  className={`flex-1 text-left text-sm font-medium ${
                    isVisible
                      ? 'text-ink-primary'
                      : 'text-ink-secondary'
                  }`}
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
      className={`flex-shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-info' : 'bg-border '
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </span>
  )
}
