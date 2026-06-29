import { useState } from 'react'
import type { Report, ReportCategory } from '../types/database'
import { CATEGORY_CONFIG } from '../lib/categoryConfig'

interface MapLegendProps {
  reports: Report[]
  visibleCategories: Set<ReportCategory>
}

export function MapLegend({ reports, visibleCategories }: MapLegendProps) {
  const [collapsed, setCollapsed] = useState(true)
  const activeCategories = Array.from(
    new Set(
      reports
        .filter((r) => visibleCategories.has(r.category))
        .map((r) => r.category)
    )
  )

  if (activeCategories.length === 0) return null

  return (
    <div className="absolute bottom-3 left-3 z-[1000] bg-bg-primary rounded-xl shadow-lg border border-border max-w-[220px]">
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-semibold text-ink-primary"
      >
        <span>Leyenda</span>
        <span>{collapsed ? '▲' : '▼'}</span>
      </button>

      {!collapsed && (
        <div className="px-3 pb-3 space-y-1.5 max-h-52 overflow-y-auto">
          {activeCategories.map((category) => {
            const config = CATEGORY_CONFIG[category]
            return (
              <div key={category} className="flex items-center gap-2">
                <span
                  className="h-4 w-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-xs text-ink-primary truncate">
                  {config.emoji} {config.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
