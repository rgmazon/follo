import { createClient } from '@/lib/supabase/client'

export type ActivityType =
  | 'note'
  | 'applied'
  | 'phone_screen'
  | 'interview'
  | 'offer'
  | 'rejection'
  | 'follow_up'
  | 'withdrawal'

export type ActivityLog = {
  id: string
  application_id: string
  type: ActivityType
  note: string | null
  event_date: string
  created_at: string
}

export async function getActivityLogs(applicationId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('application_id', applicationId)
    .order('event_date', { ascending: false })
  if (error) throw error
  return data as ActivityLog[]
}

export async function addActivityLog(entry: {
  application_id: string
  type: ActivityType
  note: string
  event_date: string
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('activity_logs')
    .insert(entry)
    .select()
    .single()
  if (error) throw error
  return data as ActivityLog
}

export async function deleteActivityLog(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('activity_logs')
    .delete()
    .eq('id', id)
  if (error) throw error
}