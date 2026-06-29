import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Report } from '../types/database'

interface UseReportsResult {
  reports: Report[]
  loading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Trae todos los reportes activos (no archivados) y se mantiene sincronizado
 * en tiempo real: cualquier insert/update/delete en la tabla `reports` se
 * refleja automáticamente sin recargar la página.
 */
export function useReports(): UseReportsResult {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = useCallback(async () => {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('reports')
      .select('*')
      .neq('status', 'archivado')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setReports((data ?? []) as Report[])
      setError(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchReports()

    const channel = supabase
      .channel('reports-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reports' },
        (payload) => {
          const newReport = payload.new as Report
          setReports((current) => [newReport, ...current])
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'reports' },
        (payload) => {
          const updated = payload.new as Report
          setReports((current) =>
            current.map((r) => (r.id === updated.id ? updated : r))
          )
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'reports' },
        (payload) => {
          const deletedId = (payload.old as Report).id
          setReports((current) => current.filter((r) => r.id !== deletedId))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchReports])

  return { reports, loading, error, refetch: fetchReports }
}
