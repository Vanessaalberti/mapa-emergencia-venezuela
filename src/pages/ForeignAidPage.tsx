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
import { Globe, Plus } from 'lucide-react'

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

      {/* TOP BAR */}
      <div className="sticky top-0 z-20 bg-bg-primary border-b border-border">

        <div className="flex items-center justify-between px-4 py-3">

          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/"
              className="h-9 w-9 flex items-center justify-center rounded-full border border-border text-ink-primary hover:bg-bg-secondary transition"
              aria-label="Volver al mapa"
            >
              ←
            </Link>

            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-info" />
                <h1 className="font-bold text-ink-primary truncate">
                  Ayuda desde el extranjero
                </h1>
              </div>
              <p className="text-xs text-ink-secondary hidden sm:block">
                Centros de apoyo venezolano en el exterior
              </p>
            </div>
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
              className="
                flex items-center gap-2
                px-4 py-2
                rounded-full
                bg-info text-white
                font-semibold text-sm
                hover:bg-info-hover
                transition
              "
            >
              <Plus size={16} />
              Publicar
            </button>

            <UserMenuButton
              onOpenAuth={() => setShowAuthModal(true)}
              onOpenProfile={() => setShowProfileModal(true)}
            />
          </div>
        </div>

        {/* 🇻🇪 FRANJA TRICOLOR (ABAJO DEL TOPBAR) */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] flex">
          <div className="flex-1 bg-[#F4D03F]" />
          <div className="flex-1 bg-[#1F4E79]" />
          <div className="flex-1 bg-[#C62828]" />
        </div>

      </div>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto p-4 space-y-8">

        <p className="text-sm text-ink-secondary leading-relaxed">
          Centros de acopio, jornadas de donación y redes de apoyo organizadas por venezolanos
          y aliados fuera del país. Esta información es independiente del mapa de emergencia
          dentro de Venezuela.
        </p>

        {loading && (
          <p className="text-center text-sm text-ink-secondary py-10">
            Cargando información…
          </p>
        )}

        {error && (
          <p className="text-sm text-critical bg-critical/10 p-3 rounded-lg">
            No se pudo cargar la información: {error}
          </p>
        )}

        {!loading && countries.length === 0 && (
          <div className="text-center py-14 space-y-2">
            <p className="text-4xl">🌍</p>
            <p className="text-ink-secondary text-sm">
              Aún no hay centros publicados. Inicia sesión para agregar información.
            </p>
          </div>
        )}

        {countries.map((country) => (
          <section key={country} className="space-y-3">

            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="font-bold text-ink-primary flex items-center gap-2">
                📍 {country}
              </h2>
              <span className="text-xs text-ink-secondary">
                {centersByCountry[country].length} centros
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {centersByCountry[country].map((center) => (
                <CenterCard key={center.id} center={center} />
              ))}
            </div>

          </section>
        ))}
      </div>

      {/* MODALS */}
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

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {showProfileModal && (
        <ProfileModal
          onClose={() => setShowProfileModal(false)}
          onOpenAdminPanel={() => {}}
        />
      )}

      {successMessage && (
        <SuccessToast
          message={successMessage}
          onDismiss={() => setSuccessMessage(null)}
        />
      )}
    </div>
  )
}

/* =========================
   CENTER CARD
========================= */

function CenterCard({ center }: { center: ForeignAidCenter }) {
  return (
    <div className="
      p-4 rounded-xl
      border border-border
      bg-bg-primary
      shadow-sm
      hover:shadow-md
      transition
      space-y-2
    ">

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-ink-primary">
          {center.title}
        </h3>

        {center.verified && (
          <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-success text-white">
            Verificado
          </span>
        )}
      </div>

      <p className="text-xs text-ink-secondary">
        📍 {center.city}
      </p>

      {center.description && (
        <p className="text-sm text-ink-primary">
          {center.description}
        </p>
      )}

      <div className="text-xs text-ink-secondary space-y-1">
        {center.address && <p>📌 {center.address}</p>}
        {center.schedule && <p>🕒 {center.schedule}</p>}
        {center.collection_dates && <p>📅 {center.collection_dates}</p>}
        {center.contact_info && <p>📞 {center.contact_info}</p>}
      </div>

      <div className="flex flex-wrap gap-2 text-[11px]">
        {center.accepts_physical_donations && (
          <span className="px-2 py-1 rounded-full bg-donation/10 text-donation">
            📦 Físicas
          </span>
        )}

        {center.accepts_monetary_donations && (
          <span className="px-2 py-1 rounded-full bg-success/10 text-success">
            💰 Monetarias
          </span>
        )}
      </div>

      {center.donation_link && (
        <a
          href={center.donation_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-info hover:underline"
        >
          Ver canal de donación →
        </a>
      )}
    </div>
  )
}
