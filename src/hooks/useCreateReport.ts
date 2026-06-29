import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { ReportInsert } from '../types/database'

interface UseCreateReportResult {
  createReport: (report: ReportInsert) => Promise<{ success: boolean; error: string | null }>
  submitting: boolean
}

export function useCreateReport(): UseCreateReportResult {
  const [submitting, setSubmitting] = useState(false)

  const createReport = async (
    report: ReportInsert
  ): Promise<{ success: boolean; error: string | null }> => {
    setSubmitting(true)

    const { data: userData } = await supabase.auth.getUser()

    const { error } = await supabase.from('reports').insert({
      ...report,
      created_by: userData.user?.id ?? null,
    })

    setSubmitting(false)

    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true, error: null }
  }

  return { createReport, submitting }
}
