import { useState } from 'react'
import type { Report, ReportStatus } from '../../types/database'
import { CATEGORY_CONFIG, STATUS_CONFIG } from '../../lib/categoryConfig'
import { useModerateReport } from '../../hooks/useModerateReport'

interface AdminReportsProps {
  reports: Report[]
}

const STATUS_OPTIONS: ReportStatus[] = [
  'sin_verificar',
  'verificado',
  'en_proceso',
  'equipo_asignado',
  'atendido',
  'resuelto',
  'archivado',
]

export function AdminReports({ reports }: AdminReportsProps) {
  const { updateStatus, deleteReport } = useModerateReport()
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  if (reports.length === 0) {
    return (
      <p className="text-sm text-ink-secondary py-6 text-center">
        Todavía no hay reportes para moderar.
      </p>
    )
  }

  const handleDelete = async (reportId: string) => {
    if (pendingDeleteId !== reportId) {
      setPendingDeleteId(reportId)
      return
    }
    await deleteReport(reportId)
    setPendingDeleteId(null)
  }

  return (
    <div className="space-y-2">
      {reports.map((report) => {
        const category = CATEGORY_CONFIG[report.category]
        const status = STATUS_CONFIG[report.status]

        return (
          <div
            key={report.id}
            className="p-3 rounded-lg border border-border dark:border-neutral-700 space-y-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-7 w-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                style={{ backgroundColor: category.color }}
              >
                {category.emoji}
              </span>
              <span className="text-sm font-semibold truncate flex-1 text-ink-primary dark:text-neutral-100">
                {report.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={report.status}
                onChange={(e) => updateStatus(report.id, e.target.value as ReportStatus)}
                className="flex-1 text-xs font-semibold rounded-lg border border-border dark:border-neutral-700 dark:bg-neutral-900 py-1.5 px-2 text-ink-primary dark:text-neutral-100"
                style={{ borderLeftColor: status.color, borderLeftWidth: 4 }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_CONFIG[s].label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => handleDelete(report.id)}
                onBlur={() => setPendingDeleteId(null)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 ${
                  pendingDeleteId === report.id
                    ? 'bg-critical text-white'
                    : 'border border-critical text-critical'
                }`}
              >
                {pendingDeleteId === report.id ? 'Confirmar' : 'Eliminar'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
