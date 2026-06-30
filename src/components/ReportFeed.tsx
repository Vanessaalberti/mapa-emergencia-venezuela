import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Report } from '../types/database'
import { CATEGORY_CONFIG, STATUS_CONFIG, PRIORITY_CONFIG } from '../lib/categoryConfig'

interface ReportFeedProps {
  reports: Report[]
  selectedReportId: string | null
  onSelectReport: (reportId: string) => void

  currentPage: number
  totalPages: number
  onNextPage: () => void
  onPreviousPage: () => void
}

export function ReportFeed({
  reports,
  selectedReportId,
  onSelectReport,
  currentPage,
  totalPages,
  onNextPage,
  onPreviousPage,
}: ReportFeedProps) {
  if (reports.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-ink-secondary">
        Todavía no hay reportes. Cuando alguien publique uno, va a aparecer aquí al instante.
      </div>
    )
  }

  return (
  <div className="h-full flex flex-col">

    {/* LISTA */}
    <div className="flex-1 overflow-y-auto divide-y divide-border">
      {reports.map((report) => {
        const category = CATEGORY_CONFIG[report.category]
        const priority = PRIORITY_CONFIG[report.priority]
        const status = STATUS_CONFIG[report.status]
        const isSelected = report.id === selectedReportId

        return (
          <button
            key={report.id}
            onClick={() => onSelectReport(report.id)}
            className={`w-full text-left p-4 flex gap-3 transition-colors ${
              isSelected ? 'bg-info/10' : 'hover:bg-bg-secondary'
            }`}
          >
            <div
              className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-lg"
              style={{ backgroundColor: category.color }}
            >
              {category.emoji}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm truncate text-ink-primary">
                  {report.title}
                </span>

                <span
                  className="flex-shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: priority.color }}
                >
                  {priority.label}
                </span>
              </div>

              {report.address && (
                <p className="text-xs text-ink-secondary truncate mt-0.5">
                  {report.address}
                </p>
              )}

              {report.description && (
                <p className="text-sm text-ink-primary/80 mt-1 line-clamp-2">
                  {report.description}
                </p>
              )}

              <div className="flex items-center gap-3 mt-2 text-xs text-ink-secondary">
                <span>
                  {formatDistanceToNow(new Date(report.created_at), {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>

                <span>•</span>

                <span className="flex items-center gap-1">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  {status.label}
                </span>

                <span>•</span>

                <span>✅ {report.confirmations_count}</span>
              </div>
            </div>
          </button>
        )
      })}
    </div>

    {/* PAGINACIÓN */}
    <div className="border-t border-border flex items-center justify-between p-3 bg-bg-primary">
      <button
        onClick={onPreviousPage}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border text-sm disabled:opacity-40"
      >
        ← Anterior
      </button>

      <span className="text-sm text-ink-secondary">
        Página {currentPage} de {totalPages}
      </span>

      <button
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border text-sm disabled:opacity-40"
      >
        Siguiente →
      </button>
    </div>

  </div>
)
}
