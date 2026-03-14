'use client'

import { useState } from 'react'
import { addActivityLog, deleteActivityLog, type ActivityLog, type ActivityType } from '@/lib/activity'

type Props = {
  applicationId: string
  logs: ActivityLog[]
  onUpdate: () => void
}

const typeLabels: Record<ActivityType, string> = {
  note: 'Note',
  applied: 'Applied',
  phone_screen: 'Phone screen',
  interview: 'Interview',
  offer: 'Offer',
  rejection: 'Rejection',
  follow_up: 'Follow-up',
  withdrawal: 'Withdrawal',
}

const typeColors: Record<ActivityType, string> = {
  note: '#888780',
  applied: '#185FA5',
  phone_screen: '#854F0B',
  interview: '#534AB7',
  offer: '#3B6D11',
  rejection: '#A32D2D',
  follow_up: '#0F6E56',
  withdrawal: '#5F5E5A',
}

export default function ActivityLog({ applicationId, logs, onUpdate }: Props) {
  const [adding, setAdding] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    type: 'note' as ActivityType,
    note: '',
    event_date: new Date().toISOString().split('T')[0],
  })

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await addActivityLog({ ...form, application_id: applicationId })
      setForm({ type: 'note', note: '', event_date: new Date().toISOString().split('T')[0] })
      setAdding(false)
      onUpdate()
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this entry?')) return
    await deleteActivityLog(id)
    onUpdate()
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

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 22,
          fontWeight: 400,
          color: 'var(--color-text)',
          margin: 0,
        }}>
          Activity
        </h2>
        <button
          onClick={() => setAdding(a => !a)}
          style={{
            background: 'transparent',
            border: '0.5px solid var(--color-border-strong)',
            borderRadius: 6,
            padding: '5px 12px',
            fontSize: 12,
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
          }}
        >
          {adding ? 'Cancel' : '+ Add entry'}
        </button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} style={{
          background: 'var(--color-surface)',
          border: '0.5px solid var(--color-border)',
          borderRadius: 10,
          padding: 16,
          marginBottom: 20,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as ActivityType }))}>
                {Object.entries(typeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Date</label>
              <input
                type="date"
                value={form.event_date}
                onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))}
              />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Note</label>
            <textarea
              value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              placeholder="What happened?"
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={submitting} style={{
              background: 'var(--color-text)',
              color: 'var(--color-bg)',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 500,
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.6 : 1,
            }}>
              {submitting ? 'Saving…' : 'Save entry'}
            </button>
          </div>
        </form>
      )}

      {logs.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--color-text-faint)', textAlign: 'center', padding: '32px 0' }}>
          No activity yet.
        </p>
      ) : (
        <div style={{ position: 'relative', paddingLeft: 20 }}>
          <div style={{
            position: 'absolute',
            left: 5,
            top: 6,
            bottom: 6,
            width: '0.5px',
            background: 'var(--color-border)',
          }} />
          {logs.map(log => (
            <div key={log.id} style={{ position: 'relative', marginBottom: 24 }}>
              <div style={{
                position: 'absolute',
                left: -18,
                top: 4,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--color-surface)',
                border: `1.5px solid ${typeColors[log.type]}`,
              }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 11,
                    fontFamily: 'var(--font-dm-mono)',
                    fontWeight: 500,
                    color: typeColors[log.type],
                  }}>
                    {typeLabels[log.type]}
                  </span>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-dm-mono)', color: 'var(--color-text-faint)' }}>
                    {new Date(log.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(log.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 12,
                    color: 'var(--color-text-faint)',
                    cursor: 'pointer',
                    padding: '2px 6px',
                  }}
                >
                  ×
                </button>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6 }}>
                {log.note}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}