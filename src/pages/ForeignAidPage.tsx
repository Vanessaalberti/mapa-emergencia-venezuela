import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForeignAidCenters } from '../hooks/useForeignAidCenters'
import { ForeignAidForm } from '../components/ForeignAidForm'
import { SuccessToast } from '../components/SuccessToast'
import type { ForeignAidCenter } from '../types/database'
import { UserMenuButton } from '../components/UserMenuButton'
import { useAuthContext } from '../store/AuthContext'
import { AuthModal } from '../components/AuthModal'
import { ProfileModal } from '../components/ProfileModal'

export function ForeignAidPage() {
  const { centers, loading, error, createCenter } = useForeignAidCenters()
  const [showForm, setShowForm] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { session } = useAuthContext()

  const centersByCountry = useMemo(() => {
    const grouped: Record<string, ForeignAidCenter[]> = {}
    for (const center of centers) {
      if (!grouped[center.country]) grouped[center.country] = []
      grouped[center.country].push(center)
    }
    return grouped
  }, [centers])

  const countries = Object.keys(centersByCountry).sort()

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-bg-primary border-b border-border sticky top-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/"
            className="flex items-center justify-center h-9 w-9 rounded-full border border-border text-ink-primary flex-shrink-0"
            aria-label="Volver al mapa"
          >
            ←
          </Link>
          <h1 className="font-bold text-ink-primary truncate">🌍 Ayuda desde el extranjero</h1>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
        <button
              type="button"
              onClick={() => {
                if (!session) {
                  setShowAuthModal(true)
                  return
                }
                setShowForm(true)
              }}
              className="px-3 py-2 rounded-full bg-info hover:bg-info-hover text-white text-sm font-semibold transition-colors"
            >
              + Publicar
            </button>

            <UserMenuButton
              onOpenAuth={() => setShowAuthModal(true)}
              onOpenProfile={() => setShowProfileModal(true)}
            />
          </div>
          </div>

      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <p className="text-sm text-ink-secondary">
          Centros de acopio, jornadas de donación y canales oficiales organizados por
          venezolanos y aliados en otros países. Esta información es independiente del mapa de
          emergencia dentro de Venezuela.
        </p>

        {loading && <p className="text-sm text-ink-secondary text-center py-8">Cargando...</p>}

        {error && (
          <p className="text-sm text-critical bg-critical/10 p-3 rounded-lg">
            No se pudo cargar la información: {error}
          </p>
        )}

        {!loading && countries.length === 0 && (
          <div className="text-center py-12 space-y-2">
            <p className="text-4xl">🌍</p>
            <p className="text-ink-secondary">
              Todavía no hay centros publicados. Si estás organizando ayuda desde el extranjero,
              iniciá sesión y publicá la información acá.
            </p>
          </div>
        )}

        {countries.map((country) => (
          <div key={country}>
            <h2 className="font-bold text-lg text-ink-primary mb-3 flex items-center gap-2">
              📍 {country}
              <span className="text-sm font-normal text-ink-secondary">
                ({centersByCountry[country].length})
              </span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {centersByCountry[country].map((center) => (
                <CenterCard key={center.id} center={center} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <ForeignAidForm
          createCenter={createCenter}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false)
            setSuccessMessage('Publicado correctamente.')
          }}
        />
      )}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {showProfileModal && (
        <ProfileModal
          onClose={() => setShowProfileModal(false)}
          onOpenAdminPanel={() => {}}
        />
      )}

      {successMessage && (
        <SuccessToast message={successMessage} onDismiss={() => setSuccessMessage(null)} />
      )}
    </div>
  )
}

function CenterCard({ center }: { center: ForeignAidCenter }) {
  return (
    <div className="p-4 rounded-xl border border-border bg-bg-primary space-y-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-ink-primary">{center.title}</h3>
        {center.verified && (
          <span className="flex-shrink-0 text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-success text-white">
            Verificado
          </span>
        )}
      </div>

      <p className="text-sm text-ink-secondary">{center.city}</p>

      {center.description && (
        <p className="text-sm text-ink-primary">{center.description}</p>
      )}

      {center.address && (
        <p className="text-sm text-ink-secondary">📍 {center.address}</p>
      )}

      {center.schedule && (
        <p className="text-sm text-ink-secondary">🕒 {center.schedule}</p>
      )}

      {center.collection_dates && (
        <p className="text-sm text-ink-secondary">📅 {center.collection_dates}</p>
      )}

      <div className="flex flex-wrap gap-2 text-xs">
        {center.accepts_physical_donations && (
          <span className="px-2 py-1 rounded-full bg-donation/10 text-donation font-medium">
            📦 Donaciones físicas
          </span>
        )}
        {center.accepts_monetary_donations && (
          <span className="px-2 py-1 rounded-full bg-success/10 text-success font-medium">
            💰 Donaciones monetarias
          </span>
        )}
      </div>

      {center.donation_link && (
        <a
          href={center.donation_link}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm font-semibold text-info underline"
        >
          Canal oficial de donación →
        </a>
      )}

      {center.contact_info && (
        <p className="text-sm text-ink-secondary">📞 {center.contact_info}</p>
      )}
    </div>
  )
}
