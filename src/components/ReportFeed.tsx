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
      <div className="flex h-full items-center justify-center p-6 text-center text-neutral-500">
        No hay reportes aún. Cuando ocurra una emergencia aparecerán aquí en tiempo real.
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-neutral-50">

      {/* LISTA */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">

        {reports.map((report) => {
          const category = CATEGORY_CONFIG[report.category]
          const priority = PRIORITY_CONFIG[report.priority]
          const status = STATUS_CONFIG[report.status]

          const isSelected = report.id === selectedReportId
          const isCritical = report.priority === 'critica'

          return (
            <button
              key={report.id}
              onClick={() => onSelectReport(report.id)}
              className={`
                w-full text-left p-4 rounded-xl
                border transition-all duration-150
                flex gap-3

                bg-white

                ${isSelected
                  ? 'border-blue-500 shadow-md'
                  : 'border-neutral-200 hover:border-neutral-300'}

                ${isCritical ? 'ring-1 ring-red-400/40' : ''}
              `}
            >

              {/* ICONO */}
              <div
                className="flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-xl shadow-sm"
                style={{ backgroundColor: category.color }}
              >
                {category.emoji}
              </div>

              {/* CONTENIDO */}
              <div className="flex-1 min-w-0">

                {/* HEADER */}
                <div className="flex items-start justify-between gap-2">

                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-neutral-900 truncate">
                      {report.title}
                    </p>

                    {report.address && (
                      <p className="text-xs text-neutral-500 truncate mt-0.5">
                        📍 {report.address}
                      </p>
                    )}
                  </div>

                  <span
                    className="flex-shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: priority.color }}
                  >
                    {priority.label}
                  </span>

                </div>

                {/* DESCRIPCIÓN */}
                {report.description && (
                  <p className="text-sm text-neutral-700 mt-2 line-clamp-2">
                    {report.description}
                  </p>
                )}

                {/* META */}
                <div className="flex items-center gap-3 mt-3 text-[11px] text-neutral-500">

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

                  <span>✔ {report.confirmations_count}</span>

                </div>

              </div>
            </button>
          )
        })}

      </div>

      {/* PAGINACIÓN */}
      <div className="border-t border-neutral-200 flex items-center justify-between p-3 bg-white">

        <button
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border text-sm disabled:opacity-40"
        >
          ← Anterior
        </button>

        <span className="text-sm text-neutral-500">
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
