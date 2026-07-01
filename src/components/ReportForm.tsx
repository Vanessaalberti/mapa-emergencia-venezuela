import { useState } from 'react'
import { Modal } from './Modal'
import { LocationPicker, type SelectedLocation } from './LocationPicker'
import { CategoryPicker } from './CategoryPicker'
import { useCreateReport } from '../hooks/useCreateReport'
import type { ReportCategory, ReportPriority } from '../types/database'
import { getPriorityByCategory } from '../lib/categoryConfig'

import {
  MapPin,
  Layers,
  FileText,
  Users,
  Phone,
  AlertTriangle
} from 'lucide-react'

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
      setSubmitError(error ?? 'Ocurrió un error al publicar el reporte. Intente nuevamente.')
    }
  }

  return (
    <Modal title={`Reporte · Paso ${step} de 3`} onClose={onClose}>
      <div className="space-y-6">

        {/* PROGRESS (VENEZUELA COLORS) */}
        <div className="flex gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`
                h-1.5 flex-1
                rounded-none

                ${
                  !s
                    ? ''
                    : s === 1
                    ? 'bg-yellow-400'
                    : s === 2
                    ? 'bg-blue-600'
                    : 'bg-red-600'
                }

                ${s <= step ? 'opacity-100' : 'opacity-20'}
              `}
            />
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-yellow-500" />
              <h3 className="text-sm font-semibold text-neutral-900">
                ¿Dónde está ocurriendo?
              </h3>
            </div>

            <LocationPicker value={location} onChange={setLocation} />
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-blue-600" />
              <h3 className="text-sm font-semibold text-neutral-900">
                Elige el tipo de situación
              </h3>
            </div>

            <CategoryPicker value={category} onChange={setCategory} />
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-5">

            <div className="flex items-center gap-2">
              <FileText size={16} className="text-red-600" />
              <h3 className="text-sm font-semibold text-neutral-900">
                Agrega información del reporte
              </h3>
            </div>

            {/* TITLE */}
            <div>
              <label className="text-xs font-medium text-neutral-600 flex items-center gap-1">
                <AlertTriangle size={12} />
                Título *
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Personas atrapadas en edificio"
                className="
                  w-full mt-1
                  px-3 py-3

                  border border-neutral-300
                  rounded-md

                  text-sm

                  focus:outline-none
                  focus:border-blue-600
                "
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-xs font-medium text-neutral-600">
                Descripción
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Agrega detalles que ayuden a ubicar la situación"
                className="
                  w-full mt-1
                  px-3 py-3

                  border border-neutral-300
                  rounded-md

                  text-sm
                "
              />
            </div>

            {/* GRID */}
            <div className="grid grid-cols-2 gap-3">

              <div>
                <label className="text-xs font-medium text-neutral-600 flex items-center gap-1">
                  <Users size={12} />
                  Personas
                </label>

                <input
                  type="number"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(e.target.value)}
                  placeholder="Estimado"
                  className="
                    w-full mt-1
                    px-3 py-2

                    border border-neutral-300
                    rounded-md

                    text-sm
                  "
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-600 flex items-center gap-1">
                  <Phone size={12} />
                  Contacto
                </label>

                <input
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Opcional"
                  className="
                    w-full mt-1
                    px-3 py-2

                    border border-neutral-300
                    rounded-md

                    text-sm
                  "
                />
              </div>
            </div>

            {/* PRIORITY */}
            {category === 'otros' && (
              <div>
                <label className="text-xs font-medium text-neutral-600">
                  Prioridad
                </label>

                <div className="grid grid-cols-4 gap-2 mt-2">
                  {(['critica', 'alta', 'media', 'baja'] as ReportPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`
                        py-2 text-xs font-semibold
                        border rounded-md

                        ${
                          priority === p
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-neutral-700 border-neutral-300'
                        }
                      `}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {submitError && (
              <div className="text-sm text-red-700 bg-red-50 p-3 rounded-md border border-red-200">
                {submitError}
              </div>
            )}

            <p className="text-[11px] text-neutral-500">
              La carga de fotos y videos estará disponible próximamente.
            </p>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex gap-3 pt-2">

          {step > 1 && (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="
                px-4 py-2
                text-sm
                border border-neutral-300
                rounded-md
              "
            >
              Atrás
            </button>
          )}

          {step < 3 && (
            <button
              disabled={step === 1 ? !canGoToStep2 : !canGoToStep3}
              onClick={() => setStep((s) => (s + 1) as Step)}
              className="
                flex-1 py-2

                text-sm font-semibold

                bg-blue-600
                text-white

                rounded-md

                disabled:opacity-40
              "
            >
              Continuar
            </button>
          )}

          {step === 3 && (
            <button
              disabled={!canSubmit || submitting}
              onClick={handleSubmit}
              className="
                flex-1 py-3

                text-sm font-bold

                bg-red-600
                text-white

                rounded-md

                disabled:opacity-40
              "
            >
              {submitting ? 'Publicando...' : 'Publicar reporte'}
            </button>
          )}
        </div>

      </div>
    </Modal>
  )
}
