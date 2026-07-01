import type { ReportCategory } from '../types/database'
import { CATEGORY_CONFIG } from '../lib/categoryConfig'
import { CATEGORY_PRIORITY } from '../lib/categoryConfig'

interface CategoryPickerProps {
  value: ReportCategory | null
  onChange: (category: ReportCategory) => void
}

const PRIORITY_ORDER = ['critica', 'alta', 'media', 'baja'] as const

export function CategoryPicker({ value, onChange }: CategoryPickerProps) {

  const grouped = PRIORITY_ORDER.map((priority) => {
    const categories = Object.entries(CATEGORY_CONFIG)
      .filter(([key]) => CATEGORY_PRIORITY[key as ReportCategory] === priority)
      .map(([key, config]) => ({
        key: key as ReportCategory,
        ...config
      }))

    return { priority, categories }
  })

  return (
    <div className="space-y-6">

      {grouped.map((group) => (
        <div key={group.priority} className="space-y-2">

          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            {group.priority === 'critica' && '🔴 Crítico'}
            {group.priority === 'alta' && '🟠 Urgente'}
            {group.priority === 'media' && '🟡 Importante'}
            {group.priority === 'baja' && '⚪ General'}
          </p>

          <div className="grid grid-cols-3 gap-3">

            {group.categories.map((cat) => {
              const isSelected = value === cat.key

              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => onChange(cat.key)}
                  className={`
                    flex flex-col items-center justify-center
                    gap-2 p-3 rounded-xl border-2
                    transition-all duration-150

                    ${isSelected
                      ? 'border-[#0B3A6E] shadow-md scale-[1.04]'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50'}
                  `}
                >

                  <div
                    className={`
                      h-11 w-11 rounded-full flex items-center justify-center text-xl
                      transition
                      ${isSelected ? 'ring-2 ring-[#0B3A6E]/30' : ''}
                    `}
                    style={{ backgroundColor: cat.color }}
                  >
                    {cat.emoji}
                  </div>

                  <span className="text-[11px] font-medium text-center leading-tight text-neutral-800">
                    {cat.label}
                  </span>

                </button>
              )
            })}

          </div>
        </div>
      ))}

    </div>
  )
}
