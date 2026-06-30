import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Report } from '../types/database'

const REPORTS_PER_PAGE = 10

interface UsePaginatedReportsResult {
  reports: Report[]
  loading: boolean
  error: string | null

  currentPage: number
  totalPages: number

  nextPage: () => void
  previousPage: () => void
}

export function usePaginatedReports(): UsePaginatedReportsResult {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchReports = useCallback(async () => {
    setLoading(true)

    const from = (currentPage - 1) * REPORTS_PER_PAGE
    const to = from + REPORTS_PER_PAGE - 1

    const {
      data,
      error: fetchError,
      count,
    } = await supabase
      .from('reports')
      .select('*', { count: 'exact' })
      .neq('status', 'archivado')
      .order('created_at', { ascending: false })
      .range(from, to)

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setReports((data ?? []) as Report[])
      setError(null)

      if (count !== null) {
        setTotalPages(Math.max(1, Math.ceil(count / REPORTS_PER_PAGE)))
      }
    }

    setLoading(false)
  }, [currentPage])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const nextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages))
  }

  const previousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1))
  }

  return {
    reports,
    loading,
    error,
    currentPage,
    totalPages,
    nextPage,
    previousPage,
  }
}