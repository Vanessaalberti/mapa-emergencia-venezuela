import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { ForeignAidCenter, ForeignAidCenterInsert } from '../types/database'

interface UseForeignAidCentersResult {
  centers: ForeignAidCenter[]
  loading: boolean
  error: string | null
  createCenter: (
    center: ForeignAidCenterInsert
  ) => Promise<{ success: boolean; error: string | null }>
  deleteCenter: (id: string) => Promise<{ success: boolean; error: string | null }>
}

export function useForeignAidCenters(): UseForeignAidCentersResult {
  const [centers, setCenters] = useState<ForeignAidCenter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Id único por instancia del hook, para que el canal de Realtime de cada
  // componente que lo use sea independiente — evita que dos instancias del
  // hook (ej: la página y un modal hijo) se pisen entre sí al desmontarse.
  const instanceId = useRef(Math.random().toString(36).slice(2)).current

  const fetchCenters = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error: fetchError } = await supabase
        .from('foreign_aid_centers')
        .select('*')
        .order('country', { ascending: true })
        .order('created_at', { ascending: false })

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setCenters((data ?? []) as unknown as ForeignAidCenter[])
        setError(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado al cargar los datos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCenters()

    const channel = supabase
      .channel(`foreign-aid-centers-realtime-${instanceId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'foreign_aid_centers' },
        () => {
          // Para esta sección, que se actualiza con poca frecuencia y no
          // tiene tanta urgencia de milisegundos como el mapa de emergencia,
          // un refetch simple ante cualquier cambio es más simple y confiable
          // que reconciliar manualmente insert/update/delete.
          fetchCenters()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchCenters, instanceId])

  const createCenter = async (center: ForeignAidCenterInsert) => {
    try {
      const { error: insertError } = await supabase.from('foreign_aid_centers').insert(center)
      return { success: !insertError, error: insertError?.message ?? null }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error inesperado al publicar.',
      }
    }
  }

  const deleteCenter = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('foreign_aid_centers')
        .delete()
        .eq('id', id)
      return { success: !deleteError, error: deleteError?.message ?? null }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Error inesperado al eliminar.',
      }
    }
  }

  return { centers, loading, error, createCenter, deleteCenter }
}
