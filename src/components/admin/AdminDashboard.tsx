import { useMemo } from 'react'
import type { Report } from '../../types/database'
import { CATEGORY_CONFIG, PRIORITY_CONFIG } from '../../lib/categoryConfig'

interface AdminDashboardProps {
  reports: Report[]
}

export function AdminDashboard({ reports }: AdminDashboardProps) {
  const stats = useMemo(() => {
    const byStatus = reports.reduce<Record<string, number>>((acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1
      return acc
    }, {})

    const byPriority = reports.reduce<Record<string, number>>((acc, r) => {
      acc[r.priority] = (acc[r.priority] ?? 0) + 1
      return acc
    }, {})

    const byCategory = reports.reduce<Record<string, number>>((acc, r) => {
      acc[r.category] = (acc[r.category] ?? 0) + 1
      return acc
    }, {})

    const topCategories = Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    return { byStatus, byPriority, topCategories, total: reports.length }
  }, [reports])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Reportes totales" value={stats.total} color="#2563EB" />
        <StatCard
          label="Críticos activos"
          value={stats.byPriority.critica ?? 0}
          color={PRIORITY_CONFIG.critica.color}
        />
        <StatCard
          label="Sin verificar"
          value={stats.byStatus.sin_verificar ?? 0}
          color="#F59E0B"
        />
        <StatCard label="Resueltos" value={stats.byStatus.resuelto ?? 0} color="#16A34A" />
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-2 text-ink-primary">
          Categorías más reportadas
        </h3>
        <div className="space-y-2">
          {stats.topCategories.length === 0 && (
            <p className="text-sm text-ink-secondary">Todavía no hay datos suficientes.</p>
          )}
          {stats.topCategories.map(([category, count]) => {
            const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG]
            const pct = stats.total > 0 ? (count / stats.total) * 100 : 0
            return (
              <div key={category} className="flex items-center gap-2">
                <span className="text-base flex-shrink-0">{config.emoji}</span>
                <span className="text-xs w-32 truncate text-ink-primary">
                  {config.label}
                </span>
                <div className="flex-1 h-2 rounded-full bg-bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: config.color }}
                  />
                </div>
                <span className="text-xs text-ink-secondary w-6 text-right">{count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="p-3 rounded-xl border border-border dark:border-neutral-700">
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
      <p className="text-xs text-ink-secondary">{label}</p>
    </div>
  )
}
