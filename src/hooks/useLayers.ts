import { useState, useMemo } from 'react'
import type { ReportCategory } from '../types/database'
import { CATEGORY_CONFIG } from '../lib/categoryConfig'

const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG) as ReportCategory[]

interface UseLayersResult {
  visibleCategories: Set<ReportCategory>
  heatmapEnabled: boolean
  toggleCategory: (category: ReportCategory) => void
  toggleHeatmap: () => void
  showAll: () => void
  hideAll: () => void
  isAllVisible: boolean
}

export function useLayers(): UseLayersResult {
  const [visibleCategories, setVisibleCategories] = useState<Set<ReportCategory>>(
    () => new Set(ALL_CATEGORIES)
  )
  const [heatmapEnabled, setHeatmapEnabled] = useState(false)

  const toggleCategory = (category: ReportCategory) => {
    setVisibleCategories((current) => {
      const next = new Set(current)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const toggleHeatmap = () => setHeatmapEnabled((current) => !current)

  const showAll = () => setVisibleCategories(new Set(ALL_CATEGORIES))
  const hideAll = () => setVisibleCategories(new Set())

  const isAllVisible = useMemo(
    () => visibleCategories.size === ALL_CATEGORIES.length,
    [visibleCategories]
  )

  return {
    visibleCategories,
    heatmapEnabled,
    toggleCategory,
    toggleHeatmap,
    showAll,
    hideAll,
    isAllVisible,
  }
}
