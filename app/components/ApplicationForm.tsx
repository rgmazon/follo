'use client'

import { useState } from 'react'
import { createApplication, type NewApplication } from '@/lib/applications'
import { Props } from 'next/dist/client/script'
import { updateApplication, type Application } from '@/lib/applications'

type Props = {
  onClose: () => void
  onCreated: () => void
  initial?: Application
}

export default function ApplicationForm({ onClose, onCreated, initial }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<NewApplication>({
  company: initial?.company ?? '',
  role: initial?.role ?? '',
  location: initial?.location ?? '',
  status: initial?.status ?? 'applied',
  job_url: initial?.job_url ?? '',
  applied_at: initial?.applied_at ?? new Date().toISOString().split('T')[0],
  salary_range: initial?.salary_range ?? '',
  recruiter_name: initial?.recruiter_name ?? '',
  recruiter_email: initial?.recruiter_email ?? '',
  recruiter_phone: initial?.recruiter_phone ?? '',
  resume_version: initial?.resume_version ?? '',
  cover_letter_version: initial?.cover_letter_version ?? '',
  notes: initial?.notes ?? '',
})

  function set(field: keyof NewApplication, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  setError(null)
  setSubmitting(true)
  try {
    if (initial) {
      await updateApplication(initial.id, form)
    } else {
      await createApplication(form)
    }
    onCreated()
    onClose()
  } catch (err: any) {
    setError(err.message)
  } finally {
    setSubmitting(false)
  }
}

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontFamily: 'var(--font-dm-mono)',
    color: 'var(--color-text-faint)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    marginBottom: 5,
  }

  const fieldStyle = { marginBottom: 16 }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed' as const,
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--color-surface)',
          border: '0.5px solid var(--color-border)',
          borderRadius: 12,
          width: '100%',
          maxWidth: 560,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 28,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 22,
            fontWeight: 400,
            color: 'var(--color-text)',
            margin: 0,
          }}>
            {initial ? 'Edit application' : 'New application'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--color-text-faint)' }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 0 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Company *</label>
              <input value={form.company} onChange={e => set('company', e.target.value)} required placeholder="Google" />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Role *</label>
              <input value={form.role} onChange={e => set('role', e.target.value)} required placeholder="Software Engineer" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Location</label>
              <input value={form.location ?? ''} onChange={e => set('location', e.target.value)} placeholder="Remote" />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="applied">Applied</option>
                <option value="phone_screen">Phone screen</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Applied date</label>
              <input type="date" value={form.applied_at} onChange={e => set('applied_at', e.target.value)} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Salary range</label>
              <input value={form.salary_range ?? ''} onChange={e => set('salary_range', e.target.value)} placeholder="$120–150k" />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Job URL</label>
            <input value={form.job_url ?? ''} onChange={e => set('job_url', e.target.value)} placeholder="https://..." />
          </div>

          <div style={{ borderTop: '0.5px solid var(--color-border)', margin: '8px 0 16px', paddingTop: 16 }}>
            <p style={{ fontSize: 11, fontFamily: 'var(--font-dm-mono)', color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
              Recruiter
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Name</label>
                <input value={form.recruiter_name ?? ''} onChange={e => set('recruiter_name', e.target.value)} placeholder="Jane Smith" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Email</label>
                <input value={form.recruiter_email ?? ''} onChange={e => set('recruiter_email', e.target.value)} placeholder="jane@company.com" />
              </div>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Phone</label>
              <input value={form.recruiter_phone ?? ''} onChange={e => set('recruiter_phone', e.target.value)} placeholder="+1 (555) 000-0000" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Resume version</label>
              <input value={form.resume_version ?? ''} onChange={e => set('resume_version', e.target.value)} placeholder="resume-v3.pdf" />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Cover letter version</label>
              <input value={form.cover_letter_version ?? ''} onChange={e => set('cover_letter_version', e.target.value)} placeholder="cl-v2.pdf" />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Notes</label>
            <textarea value={form.notes ?? ''} onChange={e => set('notes', e.target.value)} placeholder="Any notes about this application…" />
          </div>

          {error && (
            <div style={{ background: '#FCEBEB', color: '#A32D2D', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{
              background: 'transparent',
              border: '0.5px solid var(--color-border-strong)',
              borderRadius: 8,
              padding: '9px 18px',
              fontSize: 14,
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
            }}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} style={{
              background: 'var(--color-text)',
              color: 'var(--color-bg)',
              border: 'none',
              borderRadius: 8,
              padding: '9px 18px',
              fontSize: 14,
              fontWeight: 500,
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.6 : 1,
            }}>
              {submitting ? 'Saving…' : initial ? 'Save changes' : 'Save application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}