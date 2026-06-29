import { useAdminUsers } from '../../hooks/useAdminUsers'
import type { UserRole } from '../../types/database'

const ROLE_OPTIONS: UserRole[] = ['usuario', 'voluntario', 'moderador', 'administrador']

const ROLE_COLOR: Record<UserRole, string> = {
  visitante: '#94A3B8',
  usuario: '#64748B',
  voluntario: '#16A34A',
  moderador: '#2563EB',
  administrador: '#7C3AED',
}

export function AdminUsers() {
  const { profiles, loading, error, updateRole } = useAdminUsers()

  if (loading) {
    return <p className="text-sm text-ink-secondary py-6 text-center">Cargando usuarios...</p>
  }

  if (error) {
    return (
      <p className="text-sm text-critical bg-critical/10 p-3 rounded-lg">
        No se pudieron cargar los usuarios: {error}
      </p>
    )
  }

  if (profiles.length === 0) {
    return (
      <p className="text-sm text-ink-secondary py-6 text-center">
        Todavía no hay usuarios registrados.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {profiles.map((profile) => (
        <div
          key={profile.id}
          className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border dark:border-neutral-700"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: ROLE_COLOR[profile.role] }}
            >
              {(profile.display_name ?? '?').charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium truncate text-ink-primary dark:text-neutral-100">
              {profile.display_name ?? 'Sin nombre'}
            </span>
          </div>

          <select
            value={profile.role}
            onChange={(e) => updateRole(profile.id, e.target.value as UserRole)}
            className="text-xs font-semibold rounded-lg border border-border dark:border-neutral-700 dark:bg-neutral-900 py-1.5 px-2 text-ink-primary dark:text-neutral-100 flex-shrink-0"
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}
