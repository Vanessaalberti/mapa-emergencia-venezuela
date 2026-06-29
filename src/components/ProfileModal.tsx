import { Modal } from './Modal'
import { useAuthContext } from '../store/AuthContext'

interface ProfileModalProps {
  onClose: () => void
  onOpenAdminPanel: () => void
}

const ROLE_LABEL: Record<string, string> = {
  usuario: 'Usuario',
  voluntario: 'Voluntario',
  moderador: 'Moderador',
  administrador: 'Administrador',
}

const ROLE_COLOR: Record<string, string> = {
  usuario: '#64748B',
  voluntario: '#16A34A',
  moderador: '#2563EB',
  administrador: '#7C3AED',
}

export function ProfileModal({ onClose, onOpenAdminPanel }: ProfileModalProps) {
  const { session, profile, signOut } = useAuthContext()

  if (!session) return null

  const role = profile?.role ?? 'usuario'

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  return (
    <Modal title="Mi perfil" onClose={onClose}>
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div
            className="h-14 w-14 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
            style={{ backgroundColor: ROLE_COLOR[role] }}
          >
            {(profile?.display_name ?? session.user.email ?? '?').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-ink-primary truncate">
              {profile?.display_name ?? 'Sin nombre'}
            </p>
            <p className="text-sm text-ink-secondary truncate">{session.user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-ink-secondary">Rol:</span>
          <span
            className="text-xs font-bold uppercase px-2.5 py-1 rounded-full text-white"
            style={{ backgroundColor: ROLE_COLOR[role] }}
          >
            {ROLE_LABEL[role]}
          </span>
        </div>

        {(role === 'moderador' || role === 'administrador') && (
          <p className="text-xs text-ink-secondary bg-bg-secondary p-3 rounded-lg">
            Como {ROLE_LABEL[role].toLowerCase()}, podés verificar, actualizar el estado y
            moderar reportes de cualquier usuario.
          </p>
        )}

        {role === 'administrador' && (
          <button
            type="button"
            onClick={onOpenAdminPanel}
            className="w-full py-3 rounded-xl font-bold text-white bg-donation"
          >
            🛠️ Abrir panel de administración
          </button>
        )}

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full py-3 rounded-xl font-semibold border border-border text-ink-primary"
        >
          Cerrar sesión
        </button>
      </div>
    </Modal>
  )
}
