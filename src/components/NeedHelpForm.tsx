import { useEffect, useState } from 'react'
import { Modal } from './Modal'
import { LocationPicker, type SelectedLocation } from './LocationPicker'
import { useGeolocation } from '../hooks/useGeolocation'
import { useCreateReport } from '../hooks/useCreateReport'
import { CATEGORY_CONFIG } from '../lib/categoryConfig'
import type { ReportCategory } from '../types/database'

interface NeedHelpFormProps {
  onClose: () => void
  onSuccess: () => void
}

// Categorías más relevantes para una emergencia personal inmediata
const URGENT_CATEGORIES: ReportCategory[] = [
  'personas_atrapadas',
  'heridos',
  'incendios',
  'zonas_peligrosas',
  'solicitud_ayuda',
]

export function NeedHelpForm({ onClose, onSuccess }: NeedHelpFormProps) {
  const { getCurrentLocation } = useGeolocation()
  const { createReport, submitting } = useCreateReport()

  const [location, setLocation] = useState<SelectedLocation | null>(null)
  const [gpsAttempting, setGpsAttempting] = useState(true)
  const [category, setCategory] = useState<ReportCategory | null>(null)
  const [description, setDescription] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Intentamos GPS automáticamente al abrir, para que sea instantáneo cuando funciona.
  // Pero las 4 opciones de ubicación (GPS, búsqueda, mapa, coordenadas) están visibles
  // desde el primer instante — nunca se bloquea a la persona esperando solo al GPS.
  useEffect(() => {
    getCurrentLocation()
      .then((coords) => {
        setLocation({ ...coords, address: null })
        setGpsAttempting(false)
      })
      .catch(() => {
        setGpsAttempting(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const canSubmit = location !== null && category !== null

  const handleSubmit = async () => {
    if (location === null || category === null) return
    setSubmitError(null)

    const { success, error } = await createReport({
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address,
      category,
      title: `Solicitud de ayuda: ${CATEGORY_CONFIG[category].label}`,
      description: description.trim() || null,
      status: 'sin_verificar',
      priority: 'critica',
      people_count: null,
      contact_info: null,
    })

    if (success) {
      onSuccess()
    } else {
      setSubmitError(error ?? 'No se pudo publicar. Intenta de nuevo.')
    }
  }

  return (
    <Modal title="🆘 Necesito Ayuda" onClose={onClose}>
      <div className="space-y-5">
        {}
        <div className="space-y-3">
          <h3 className="font-semibold text-ink-primary">¿Dónde estás?</h3>

          {gpsAttempting && (
            <div className="p-3 rounded-lg text-sm bg-bg-secondary dark:bg-neutral-800 text-ink-primary dark:text-neutral-200">
              📍 Intentando obtener tu ubicación automáticamente... también puedes elegir otra
              opción abajo en cualquier momento.
            </div>
          )}

          <LocationPicker value={location} onChange={setLocation} />
        </div>

        {/* Categoría */}
        <div>
          <h3 className="font-semibold mb-3 text-ink-primary">
            ¿Qué está pasando?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {URGENT_CATEGORIES.map((cat) => {
              const config = CATEGORY_CONFIG[cat]
              const isSelected = category === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-2 p-4 rounded-xl border-2 ${
                    isSelected
                      ? 'border-critical bg-critical/10 '
                      : 'border-border'
                  }`}
                >
                  <span className="text-2xl">{config.emoji}</span>
                  <span className="text-sm font-bold text-left leading-tight text-ink-primary ">
                    {config.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1 text-ink-primary">
            Descripción breve (opcional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="¿Algo más que debamos saber?"
            rows={2}
            className="w-full p-3 text-base rounded-lg border border-border bg-bg-primary text-ink-primary"
          />
        </div>

        {submitError && (
          <p className="text-sm text-critical bg-critical/10 p-3 rounded-lg">
            {submitError}
          </p>
        )}

        <button
          type="button"
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
          className="w-full py-5 rounded-xl font-bold text-xl text-white bg-critical disabled:opacity-40"
        >
          {submitting ? 'Publicando...' : 'PUBLICAR AHORA'}
        </button>
      </div>
    </Modal>
  )
}
