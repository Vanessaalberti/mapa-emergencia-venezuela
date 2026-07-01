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

  useEffect(() => {
    getCurrentLocation()
      .then((coords) => {
        setLocation({ ...coords, address: null })
        setGpsAttempting(false)
      })
      .catch(() => {
        setGpsAttempting(false)
      })
  }, [])

  const canSubmit = location !== null && category !== null

  const handleSubmit = async () => {
    if (!location || !category) return

    setSubmitError(null)

    const { success, error } = await createReport({
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address,
      category,
      title: `Ayuda urgente: ${CATEGORY_CONFIG[category].label}`,
      description: description.trim() || null,
      status: 'sin_verificar',
      priority: 'critica',
      people_count: null,
      contact_info: null,
    })

    if (success) {
      onSuccess()
    } else {
      setSubmitError(error ?? 'No se pudo publicar. Intenta nuevamente.')
    }
  }

  return (
    <Modal title="🆘 Solicitar ayuda urgente" onClose={onClose}>
      <div className="space-y-6">

        {/* UBICACIÓN */}
        <div className="space-y-3">
          <h3 className="font-semibold text-neutral-900">
            Indica tu ubicación
          </h3>

          {gpsAttempting && (
            <div className="p-3 rounded-lg text-sm bg-neutral-100 text-neutral-700">
              📍 Intentando detectar tu ubicación automáticamente…
              Puedes cambiarlo en cualquier momento abajo.
            </div>
          )}

          <LocationPicker value={location} onChange={setLocation} />
        </div>

        {/* CATEGORÍAS */}
        <div className="space-y-3">
          <h3 className="font-semibold text-neutral-900">
            ¿Qué está ocurriendo?
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
                  className={`
                    flex items-center gap-3

                    p-4

                    rounded-lg

                    border

                    transition

                    ${isSelected
                      ? 'border-[#C62828] bg-[#C62828]/10'
                      : 'border-neutral-200 bg-white'}
                  `}
                >
                  <span className="text-2xl">{config.emoji}</span>

                  <span className="text-sm font-semibold text-left leading-tight text-neutral-900">
                    {config.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* DESCRIPCIÓN */}
        <div>
          <label className="text-sm font-medium block mb-2 text-neutral-800">
            Detalles (opcional)
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe brevemente lo que ocurre"
            rows={3}
            className="
              w-full
              p-3

              text-sm

              border border-neutral-200
              rounded-lg

              bg-white
              text-neutral-900
            "
          />
        </div>

        {/* ERROR */}
        {submitError && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {submitError}
          </p>
        )}

        {/* BOTÓN PRINCIPAL (MÁS EMERGENCIA REAL) */}
        <button
          type="button"
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
          className="
            w-full

            py-5

            rounded-lg

            font-black
            text-lg

            text-white

            bg-[#C62828]
            hover:bg-[#B71C1C]

            shadow-md

            disabled:opacity-40

            active:scale-[0.99]

            transition
          "
        >
          {submitting ? 'PUBLICANDO...' : 'PEDIR AYUDA AHORA'}
        </button>

      </div>
    </Modal>
  )
}
