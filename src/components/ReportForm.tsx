import { useState } from 'react'
import { Modal } from './Modal'
import { LocationPicker, type SelectedLocation } from './LocationPicker'
import { CategoryPicker } from './CategoryPicker'
import { useCreateReport } from '../hooks/useCreateReport'
import type { ReportCategory, ReportPriority } from '../types/database'
import { getPriorityByCategory } from '../lib/categoryConfig'

interface ReportFormProps {
  onClose: () => void
  onSuccess: () => void
}

type Step = 1 | 2 | 3

export function ReportForm({ onClose, onSuccess }: ReportFormProps) {
  const [step, setStep] = useState<Step>(1)
  const [location, setLocation] = useState<SelectedLocation | null>(null)
  const [category, setCategory] = useState<ReportCategory | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [peopleCount, setPeopleCount] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [priority, setPriority] = useState<ReportPriority>('media')
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { createReport, submitting } = useCreateReport()

  const canGoToStep2 = location !== null
  const canGoToStep3 = category !== null
  const canSubmit = title.trim().length > 0

  const handleSubmit = async () => {
    if (!location || !category || !canSubmit) return

    setSubmitError(null)
    const reportPriority =
      category === 'otros'
        ? priority
        : getPriorityByCategory(category)
    const { success, error } = await createReport({
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address,
      category,
      title: title.trim(),
      description: description.trim() || null,
      status: 'sin_verificar',
      priority: reportPriority,
      people_count: peopleCount ? parseInt(peopleCount, 10) : null,
      contact_info: contactInfo.trim() || null,
    })

    if (success) {
      onSuccess()
    } else {
      setSubmitError(error ?? 'Ocurrió un error al publicar el reporte. Intenta de nuevo.')
    }
  }

  return (
    <Modal title={`Reportar — Paso ${step} de 3`} onClose={onClose}>
      <div className="space-y-5">
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full ${
                s <= step ? 'bg-info' : 'bg-border'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold">¿Dónde está ocurriendo?</h3>
            <LocationPicker value={location} onChange={setLocation} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold">¿Qué tipo de situación es?</h3>
            <CategoryPicker value={category} onChange={setCategory} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Agregá información</h3>

            <div>
              <label className="text-sm font-medium block mb-1">Título *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Familia atrapada en edificio"
                className="w-full p-3 text-base rounded-lg border border-border text-ink-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalles que puedan ayudar a los equipos de rescate"
                rows={3}
                className="w-full p-3 text-base rounded-lg border border-border text-ink-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium block mb-1">Cantidad de personas</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(e.target.value)}
                  placeholder="Aprox."
                  className="w-full p-3 text-base rounded-lg border border-border text-ink-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Contacto</label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Teléfono (opcional)"
                  className="w-full p-3 text-base rounded-lg border border-border text-ink-primary"
                />
              </div>
            </div>

            {category === 'otros' && (
            <div>
              <label className="text-sm font-medium block mb-2">
                Prioridad
              </label>

              <div className="grid grid-cols-4 gap-2">
                {(['critica', 'alta', 'media', 'baja'] as ReportPriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 rounded-lg text-sm font-semibold border-2 capitalize ${
                      priority === p
                        ? 'border-info bg-info/10'
                        : 'border-neutral-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            )}

            <p className="text-xs text-ink-secondary">
              📷 Fotos, videos y audio estarán disponibles próximamente.
            </p>

            {submitError && (
              <p className="text-sm text-critical bg-critical/10 p-3 rounded-lg">
                {submitError}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="px-5 py-3 rounded-xl font-semibold border border-border text-ink-primary"
            >
              Atrás
            </button>
          )}

          {step < 3 && (
            <button
              type="button"
              disabled={step === 1 ? !canGoToStep2 : !canGoToStep3}
              onClick={() => setStep((s) => (s + 1) as Step)}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-info disabled:opacity-40"
            >
              Continuar
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              disabled={!canSubmit || submitting}
              onClick={handleSubmit}
              className="flex-1 py-4 rounded-xl font-bold text-lg text-white bg-critical disabled:opacity-40"
            >
              {submitting ? 'Publicando...' : 'PUBLICAR REPORTE'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
