import { useAuthContext } from '../store/AuthContext'

interface UserMenuButtonProps {
  onOpenAuth: () => void
  onOpenProfile: () => void
}

const ROLE_BADGE_COLOR: Record<string, string> = {
  usuario: '#64748B',
  voluntario: '#16A34A',
  moderador: '#2563EB',
  administrador: '#7C3AED',
}

export function UserMenuButton({ onOpenAuth, onOpenProfile }: UserMenuButtonProps) {
  const { session, profile } = useAuthContext()

  if (!session) {
    return (
      <button
        type="button"
        onClick={onOpenAuth}
        aria-label="Iniciar sesión"
        className="flex items-center justify-center h-9 w-9 rounded-full border border-border text-ink-primary"
      >
        👤
      </button>
    )
  }

  const initial = (profile?.display_name ?? session.user.email ?? '?').charAt(0).toUpperCase()
  const badgeColor = profile ? ROLE_BADGE_COLOR[profile.role] ?? '#64748B' : '#64748B'

  return (
    <button
      type="button"
      onClick={onOpenProfile}
      aria-label="Mi perfil"
      className="flex items-center justify-center h-9 w-9 rounded-full text-white font-bold text-sm"
      style={{ backgroundColor: badgeColor }}
    >
      {initial}
    </button>
  )
}
