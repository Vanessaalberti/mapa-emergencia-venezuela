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

export function ForeignAidForm({ onClose, onSuccess, createCenter }: ForeignAidFormProps) {
  const { session } = useAuthContext()


  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [schedule, setSchedule] = useState('')
  const [collectionDates, setCollectionDates] = useState('')
  const [acceptsPhysical, setAcceptsPhysical] = useState(true)
  const [acceptsMonetary, setAcceptsMonetary] = useState(false)
  const [donationLink, setDonationLink] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!session) {
    return (
      <Modal title="Inicia sesion" onClose={onClose}>
        <p className="text-sm text-ink-secondary">
          Para publicar un centro de acopio o canal de donación se requiere iniciar sesion, para
          mantener la información trazable y confiable.
        </p>
      </Modal>
    )
  }

  const canSubmit = country.trim() && city.trim() && title.trim()

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
      accepts_physical_donations: acceptsPhysical,
      accepts_monetary_donations: acceptsMonetary,
      donation_link: donationLink.trim() || null,
      contact_info: contactInfo.trim() || null,
      created_by: session.user.id,
    })

    setSubmitting(false)

    if (success) {
      onSuccess()
    } else {
      setError(submitError ?? 'No se pudo publicar. Intenta de nuevo.')
    }
  }

  return (
    <Modal title="Publicar centro de ayuda" onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium block mb-1 text-ink-primary">
              País *
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="España"
              className="w-full p-3 text-base rounded-lg border border-border text-ink-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1 text-ink-primary">
              Ciudad *
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Madrid"
              className="w-full p-3 text-base rounded-lg border border-border text-ink-primary"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1 text-ink-primary">
            Título *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Centro de acopio Comunidad Venezolana de Madrid"
            className="w-full p-3 text-base rounded-lg border border-border text-ink-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1 text-ink-primary">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="¿Qué tipo de ayuda se está organizando?"
            rows={2}
            className="w-full p-3 text-base rounded-lg border border-border text-ink-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1 text-ink-primary">
            Dirección *
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Calle, número, ciudad"
            className="w-full p-3 text-base rounded-lg border border-border text-ink-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium block mb-1 text-ink-primary">
              Horario
            </label>
            <input
              type="text"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              placeholder="Lun a vie, 9am-6pm"
              className="w-full p-3 text-base rounded-lg border border-border dark:border-neutral-700 dark:bg-neutral-900 text-ink-primary dark:text-neutral-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1 text-ink-primary dark:text-neutral-100">
              Fechas de jornada
            </label>
            <input
              type="text"
              value={collectionDates}
              onChange={(e) => setCollectionDates(e.target.value)}
              placeholder="15 y 16 de julio"
              className="w-full p-3 text-base rounded-lg border border-border dark:border-neutral-700 dark:bg-neutral-900 text-ink-primary dark:text-neutral-100"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-ink-primary dark:text-neutral-100">
            <input
              type="checkbox"
              checked={acceptsPhysical}
              onChange={(e) => setAcceptsPhysical(e.target.checked)}
              className="h-4 w-4"
            />
            Recibe donaciones físicas
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-primary dark:text-neutral-100">
            <input
              type="checkbox"
              checked={acceptsMonetary}
              onChange={(e) => setAcceptsMonetary(e.target.checked)}
              className="h-4 w-4"
            />
            Recibe donaciones monetarias
          </label>
        </div>

        {acceptsMonetary && (
          <div>
            <label className="text-sm font-medium block mb-1 text-ink-primary dark:text-neutral-100">
              Canal oficial de donación (link)
            </label>
            <input
              type="text"
              value={donationLink}
              onChange={(e) => setDonationLink(e.target.value)}
              placeholder="https://..."
              className="w-full p-3 text-base rounded-lg border border-border dark:border-neutral-700 dark:bg-neutral-900 text-ink-primary dark:text-neutral-100"
            />
          </div>
        )}

        <div>
          <label className="text-sm font-medium block mb-1 text-ink-primary dark:text-neutral-100">
            Contacto
          </label>
          <input
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            placeholder="Teléfono, email o red social"
            className="w-full p-3 text-base rounded-lg border border-border dark:border-neutral-700 dark:bg-neutral-900 text-ink-primary dark:text-neutral-100"
          />
        </div>

        {error && (
          <p className="text-sm text-critical bg-critical/10 p-3 rounded-lg">{error}</p>
        )}

        <button
          type="button"
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl font-bold text-white bg-info disabled:opacity-40"
        >
          {submitting ? 'Publicando...' : 'Publicar'}
        </button>
      </div>
    </Modal>
  )
}
