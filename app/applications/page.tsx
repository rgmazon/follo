'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getApplications, type Application } from '@/lib/applications'
import StatusBadge from '@/app/components/StatusBadge'
import ApplicationForm from '@/app/components/ApplicationForm'
import Toast from '@/app/components/Toast'

export default function ApplicationsPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('date_desc')

  useEffect(() => {
    getApplications()
      .then(setApplications)
      .finally(() => setLoading(false))
  }, [])

  const filtered = applications
    .filter(app => {
      const matchesSearch =
        app.company.toLowerCase().includes(search.toLowerCase()) ||
        app.role.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()
        case 'date_asc':
          return new Date(a.applied_at).getTime() - new Date(b.applied_at).getTime()
        case 'company_asc':
          return a.company.localeCompare(b.company)
        case 'company_desc':
          return b.company.localeCompare(a.company)
        case 'status':
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

  if (loading) return (
    <div style={{ padding: 32, color: 'var(--color-text-faint)', fontSize: 14 }}>
      Loading…
    </div>
  )

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 28px' }}>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 32,
            fontWeight: 400,
            color: 'var(--color-text)',
            margin: '0 0 6px',
          }}>
            Applications
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-faint)', fontFamily: 'var(--font-dm-mono)', margin: 0 }}>
            {filtered.length} of {applications.length} total
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            background: 'var(--color-text)',
            color: 'var(--color-bg)',
            border: 'none',
            borderRadius: 8,
            padding: '9px 18px',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          + New application
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search company or role…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ width: 'auto' }}
        >
          <option value="all">All statuses</option>
          <option value="applied">Applied</option>
          <option value="phone_screen">Phone screen</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
        <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="date_desc">Newest first</option>
                <option value="date_asc">Oldest first</option>
                <option value="company_asc">Company A–Z</option>
                <option value="company_desc">Company Z–A</option>
                <option value="status">By status</option>
              </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 0',
          color: 'var(--color-text-faint)',
          fontSize: 14,
        }}>
          {applications.length === 0 ? 'No applications yet. Add your first one!' : 'No results match your search.'}
        </div>
      ) : (
        <div style={{
          background: 'var(--color-surface)',
          border: '0.5px solid var(--color-border)',
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          {filtered.map((app, i) => (
            <div
              key={app.id}
              onClick={() => router.push(`/applications/${app.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: i < filtered.length - 1 ? '0.5px solid var(--color-border)' : 'none',
                cursor: 'pointer',
                gap: 12,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {app.company}
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {app.role}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-dm-mono)', color: 'var(--color-text-faint)' }}>
                  {new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <StatusBadge status={app.status} />
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ApplicationForm
          onClose={() => setShowForm(false)}
          onCreated={() => {
            getApplications().then(setApplications)
            setToast('Application saved!')
          }}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}