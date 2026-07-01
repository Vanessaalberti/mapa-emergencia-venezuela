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

  const Input = (props: any) => (
    <input
      {...props}
      className="w-full p-3 text-sm rounded-lg border border-border bg-white text-ink-primary focus:outline-none focus:ring-2 focus:ring-info/30"
    />
  )

  const Textarea = (props: any) => (
    <textarea
      {...props}
      className="w-full p-3 text-sm rounded-lg border border-border bg-white text-ink-primary focus:outline-none focus:ring-2 focus:ring-info/30 resize-none"
    />
  )

  return (
    <Modal title="Publicar centro de ayuda" onClose={onClose}>
      <div className="space-y-5">

        {/* país / ciudad */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-ink-primary">
              País *
            </label>
            <Input
              value={country}
              onChange={(e: any) => setCountry(e.target.value)}
              placeholder="Ej: España, Argentina, Colombia"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-primary">
              Ciudad *
            </label>
            <Input
              value={city}
              onChange={(e: any) => setCity(e.target.value)}
              placeholder="Ej: Madrid, Buenos Aires"
            />
          </div>
        </div>

        {/* título */}
        <div>
          <label className="text-xs font-semibold text-ink-primary">
            Nombre del centro *
          </label>
          <Input
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
            placeholder="Ej: Centro de acopio Comunidad Venezolana"
          />
        </div>

        {/* descripción */}
        <div>
          <label className="text-xs font-semibold text-ink-primary">
            Descripción
          </label>
          <Textarea
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
            placeholder="Ej: Estamos recolectando alimentos, medicinas y ropa para envío a Venezuela"
            rows={3}
          />
        </div>

        {/* dirección */}
        <div>
          <label className="text-xs font-semibold text-ink-primary">
            Dirección *
          </label>
          <Input
            value={address}
            onChange={(e: any) => setAddress(e.target.value)}
            placeholder="Ej: Av. Principal 123, Barrio Centro"
          />
        </div>

        {/* detalles */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-ink-primary">
              Horario
            </label>
            <Input
              value={schedule}
              onChange={(e: any) => setSchedule(e.target.value)}
              placeholder="Ej: Lunes a viernes 9:00 - 18:00"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-primary">
              Fechas
            </label>
            <Input
              value={collectionDates}
              onChange={(e: any) => setCollectionDates(e.target.value)}
              placeholder="Ej: 15 al 20 de julio"
            />
          </div>
        </div>

        {/* contacto */}
        <div>
          <label className="text-xs font-semibold text-ink-primary">
            Contacto
          </label>
          <Input
            value={contactInfo}
            onChange={(e: any) => setContactInfo(e.target.value)}
            placeholder="Ej: +34 600 000 000 / Instagram @ayuda.ve"
          />
        </div>

        {/* link */}
        <div>
          <label className="text-xs font-semibold text-ink-primary">
            Link externo (opcional)
          </label>
          <Input
            value={donationLink}
            onChange={(e: any) => setDonationLink(e.target.value)}
            placeholder="Ej: https://instagram.com/organizacion"
          />
        </div>

        {/* error */}
        {error && (
          <div className="p-3 rounded-lg text-sm bg-critical/10 text-critical">
            {error}
          </div>
        )}

        {/* submit */}
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
