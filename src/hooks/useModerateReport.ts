import { supabase } from '../lib/supabaseClient'
import type { ReportStatus } from '../types/database'

interface UseModerateReportResult {
  updateStatus: (reportId: string, status: ReportStatus) => Promise<{ success: boolean; error: string | null }>
  deleteReport: (reportId: string) => Promise<{ success: boolean; error: string | null }>
}

export function useModerateReport(): UseModerateReportResult {
  const updateStatus = async (reportId: string, status: ReportStatus) => {
    const { error } = await supabase.from('reports').update({ status }).eq('id', reportId)
    return { success: !error, error: error?.message ?? null }
  }

  const deleteReport = async (reportId: string) => {
    const { error } = await supabase.from('reports').delete().eq('id', reportId)
    return { success: !error, error: error?.message ?? null }
  }

  return { updateStatus, deleteReport }
}
