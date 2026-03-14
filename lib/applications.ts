import { createClient } from '@/lib/supabase/client'

export type ApplicationStatus =
  | 'applied'
  | 'phone_screen'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn'

export type Application = {
  id: string
  user_id: string
  company: string
  role: string
  location: string | null
  status: ApplicationStatus
  job_url: string | null
  applied_at: string
  salary_range: string | null
  recruiter_name: string | null
  recruiter_email: string | null
  recruiter_phone: string | null
  resume_version: string | null
  cover_letter_version: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type NewApplication = Omit<Application, 'id' | 'user_id' | 'created_at' | 'updated_at'>

export async function getApplications() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('applied_at', { ascending: false })
  if (error) throw error
  return data as Application[]
}

export async function getApplication(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Application
}

export async function createApplication(values: NewApplication) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('applications')
    .insert({ ...values, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data as Application
}

export async function updateApplication(id: string, values: Partial<NewApplication>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('applications')
    .update(values)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Application
}

export async function deleteApplication(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id)
  if (error) throw error
}