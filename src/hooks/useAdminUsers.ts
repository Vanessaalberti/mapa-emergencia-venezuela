import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Profile, UserRole } from '../types/database'

interface UseAdminUsersResult {
  profiles: Profile[]
  loading: boolean
  error: string | null
  updateRole: (userId: string, role: UserRole) => Promise<{ success: boolean; error: string | null }>
  refetch: () => void
}

export function useAdminUsers(): UseAdminUsersResult {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfiles = useCallback(async () => {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setProfiles(data ?? [])
      setError(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  const updateRole = async (userId: string, role: UserRole) => {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    setProfiles((current) =>
      current.map((p) => (p.id === userId ? { ...p, role } : p))
    )
    return { success: true, error: null }
  }

  return { profiles, loading, error, updateRole, refetch: fetchProfiles }
}
