import { useState } from 'react'
import { Modal } from './Modal'
import { useAuthContext } from '../store/AuthContext'
import type { ForeignAidCenterInsert } from '../types/database'

interface ForeignAidFormProps {
  onClose: () => void
  onSuccess: () => void
  createCenter: (
    center: ForeignAidCenterInsert
  ) => Promise<{ success: boolean; error: string | null }>
}

export function ForeignAidForm({
  onClose,
  onSuccess,
  createCenter,
}: ForeignAidFormProps) {
  const { session } = useAuthContext()

  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [schedule, setSchedule] = useState('')
  const [collectionDates, setCollectionDates] = useState('')
  const [donationLink, setDonationLink] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!session) {
    return (
      <Modal title="Iniciar sesión" onClose={onClose}>
        <p className="text-sm text-ink-secondary">
          Necesitas iniciar sesión para publicar un centro de ayuda.
        </p>
      </Modal>
    )
  }

  const canSubmit =
    country.trim() && city.trim() && title.trim() && address.trim()

  const handleSubmit = async () => {
    if (!canSubmit) return

    setSubmitting(true)
    setError(null)

    const { success, error: submitError } = await createCenter({
      country: country.trim(),
      city: city.trim(),
      title: title.trim(),
      description: description.trim() || null,
      address: address.trim() || null,
      schedule: schedule.trim() || null,
      collection_dates: collectionDates.trim() || null,
      donation_link: donationLink.trim() || null,
      contact_info: contactInfo.trim() || null,
      created_by: session.user.id,
    })

    setSubmitting(false)

    if (success) onSuccess()
    else setError(submitError ?? 'No se pudo publicar. Intenta de nuevo.')
  }

  const inputClass =
    'w-full p-3 text-sm rounded-lg border border-border bg-white text-ink-primary focus:outline-none focus:ring-2 focus:ring-info/30'

  const textareaClass =
    inputClass + ' resize-none'

  return (
    <Modal title="Publicar centro de ayuda" onClose={onClose}>
      <div className="space-y-5">

        {/* País / Ciudad */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-ink-primary">
              País *
            </label>
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Ej: España / Argentina / Colombia"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-primary">
              Ciudad *
            </label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ej: Madrid / Buenos Aires"
              className={inputClass}
            />
          </div>
        </div>

        {/* Título */}
        <div>
          <label className="text-xs font-semibold text-ink-primary">
            Nombre del centro *
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Centro de acopio Comunidad Venezolana"
            className={inputClass}
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="text-xs font-semibold text-ink-primary">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Recolectamos alimentos, medicinas y ropa para envío humanitario"
            rows={3}
            className={textareaClass}
          />
        </div>

        {/* Dirección */}
        <div>
          <label className="text-xs font-semibold text-ink-primary">
            Dirección *
          </label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ej: Av. Principal 123, Barrio Centro"
            className={inputClass}
          />
        </div>

        {/* Detalles */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-ink-primary">
              Horario
            </label>
            <input
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              placeholder="Ej: Lun a Vie 9:00 - 18:00"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-primary">
              Fechas
            </label>
            <input
              value={collectionDates}
              onChange={(e) => setCollectionDates(e.target.value)}
              placeholder="Ej: 15 al 20 de julio"
              className={inputClass}
            />
          </div>
        </div>

        {/* Contacto */}
        <div>
          <label className="text-xs font-semibold text-ink-primary">
            Contacto
          </label>
          <input
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            placeholder="Ej: WhatsApp +34 600 000 000 / Instagram @ayuda"
            className={inputClass}
          />
        </div>

        {/* Link */}
        <div>
          <label className="text-xs font-semibold text-ink-primary">
            Link externo (opcional)
          </label>
          <input
            value={donationLink}
            onChange={(e) => setDonationLink(e.target.value)}
            placeholder="Ej: https://instagram.com/organizacion"
            className={inputClass}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 rounded-lg text-sm bg-critical/10 text-critical">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="button"
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl font-bold text-white bg-info disabled:opacity-40"
        >
          {submitting ? 'Publicando...' : 'Publicar centro'}
        </button>

      </div>
    </Modal>
  )
}
