import { UserMenuButton } from './UserMenuButton'

interface TopBarProps {
  onOpenReportForm: () => void
  onOpenLayersPanel: () => void
  onOpenAuth: () => void
  onOpenProfile: () => void
}

export function TopBar({
  onOpenReportForm,
  onOpenAuth,
  onOpenProfile,
}: TopBarProps) {
  return (
    <div className="sticky top-0 z-[2000] flex items-center justify-between gap-3 px-3 py-2 bg-bg-primary border-b border-border">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-2xl flex-shrink-0">🚨</span>
        <span className="font-bold text-sm sm:text-base truncate text-ink-primary">
          Mapa de Emergencia Venezuela
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={onOpenReportForm}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-info hover:bg-info-hover text-white text-sm font-semibold transition-colors"
        >
          <span>📝</span>
          <span className="hidden sm:inline">Reportar</span>
        </button>

        <UserMenuButton onOpenAuth={onOpenAuth} onOpenProfile={onOpenProfile} />
      </div>
    </div>
  )
}
