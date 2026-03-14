'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getApplication, deleteApplication, type Application } from '@/lib/applications'
import StatusBadge from '@/app/components/StatusBadge'
import Toast from '@/app/components/Toast'
import ApplicationForm from '@/app/components/ApplicationForm'
import ActivityLogComponent from '@/app/components/ActivityLog'
import { getActivityLogs, type ActivityLog } from '@/lib/activity'

export default function ApplicationDetailPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const [app, setApp] = useState<Application | null>(null)
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [logs, setLogs] = useState<ActivityLog[]>([])

    useEffect(() => {
        Promise.all([
            getApplication(id),
            getActivityLogs(id),
        ]).then(([app, logs]) => {
            setApp(app)
            setLogs(logs)
        }).finally(() => setLoading(false))
    }, [id])

    async function handleDelete() {
        if (!confirm('Delete this application?')) return
        setDeleting(true)
        try {
            await deleteApplication(id)
            router.push('/applications')
        } catch (err: any) {
            setToast(err.message)
            setDeleting(false)
        }
    }

    if (loading) return (
        <div style={{ padding: 32, color: 'var(--color-text-faint)', fontSize: 14 }}>Loading…</div>
    )

    if (!app) return (
        <div style={{ padding: 32, color: 'var(--color-text-faint)', fontSize: 14 }}>Application not found.</div>
    )

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 28px' }}>

            <button
                onClick={() => router.push('/applications')}
                style={{
                    background: 'none',
                    border: '0.5px solid var(--color-border-strong)',
                    borderRadius: 6,
                    padding: '5px 12px',
                    fontSize: 13,
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    marginBottom: 28,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                }}
            >
                ← Back
            </button>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
                <div>
                    <h1 style={{
                        fontFamily: 'var(--font-playfair)',
                        fontSize: 32,
                        fontWeight: 400,
                        color: 'var(--color-text)',
                        margin: '0 0 6px',
                    }}>
                        {app.company}
                    </h1>
                    <p style={{ fontSize: 16, color: 'var(--color-text-muted)', margin: '0 0 12px' }}>{app.role}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        <StatusBadge status={app.status} />
                        {app.location && (
                            <span style={{
                                fontSize: 12,
                                fontFamily: 'var(--font-dm-mono)',
                                color: 'var(--color-text-faint)',
                                background: 'var(--color-surface)',
                                border: '0.5px solid var(--color-border)',
                                borderRadius: 20,
                                padding: '3px 9px',
                            }}>
                                {app.location}
                            </span>
                        )}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={() => setShowEdit(true)}
                        style={{
                            background: 'none',
                            border: '0.5px solid var(--color-border-strong)',
                            borderRadius: 8,
                            padding: '7px 14px',
                            fontSize: 13,
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                        }}
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        style={{
                            background: 'none',
                            border: '0.5px solid #F09595',
                            borderRadius: 8,
                            padding: '7px 14px',
                            fontSize: 13,
                            color: '#A32D2D',
                            cursor: 'pointer',
                            opacity: deleting ? 0.5 : 1,
                        }}
                    >
                        {deleting ? 'Deleting…' : 'Delete'}
                    </button>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                border: '0.5px solid var(--color-border)',
                borderRadius: 12,
                overflow: 'hidden',
                marginBottom: 24,
            }}>
                {[
                    { label: 'Applied', value: new Date(app.applied_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
                    { label: 'Salary range', value: app.salary_range },
                    { label: 'Resume version', value: app.resume_version },
                    { label: 'Cover letter', value: app.cover_letter_version },
                ].map(({ label, value }, i) => (
                    <div key={label} style={{
                        padding: '14px 16px',
                        borderBottom: i < 2 ? '0.5px solid var(--color-border)' : 'none',
                        borderRight: i % 2 === 0 ? '0.5px solid var(--color-border)' : 'none',
                    }}>
                        <div style={{ fontSize: 11, fontFamily: 'var(--font-dm-mono)', color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                            {label}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>
                            {value ?? '—'}
                        </div>
                    </div>
                ))}
            </div>

            {app.job_url && (
                <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-dm-mono)', color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                        Job URL
                    </div>
                    <a href={app.job_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#185FA5', wordBreak: 'break-all' }}>
                        {app.job_url}
                    </a>
                </div>
            )}

            {(app.recruiter_name || app.recruiter_email || app.recruiter_phone) && (
                <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-dm-mono)', color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                        Recruiter
                    </div>
                    <div style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: 10, padding: 16 }}>
                        {app.recruiter_name && <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)', marginBottom: 4 }}>{app.recruiter_name}</div>}
                        {app.recruiter_email && <div style={{ fontSize: 13, fontFamily: 'var(--font-dm-mono)', color: 'var(--color-text-muted)' }}>{app.recruiter_email}</div>}
                        {app.recruiter_phone && <div style={{ fontSize: 13, fontFamily: 'var(--font-dm-mono)', color: 'var(--color-text-muted)' }}>{app.recruiter_phone}</div>}
                    </div>
                </div>
            )}

            {app.notes && (
                <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-dm-mono)', color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                        Notes
                    </div>
                    <div style={{ background: 'var(--color-surface)', border: '0.5px solid var(--color-border)', borderRadius: 10, padding: 16, fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                        {app.notes}
                    </div>
                </div>
            )}

            {toast && <Toast message={toast} type="error" onClose={() => setToast(null)} />}
            {showEdit && app && (
                <ApplicationForm
                    initial={app}
                    onClose={() => setShowEdit(false)}
                    onCreated={() => {
                        getApplication(id).then(setApp)
                        setToast('Changes saved!')
                    }}
                />
            )}
            <div style={{ marginTop: 32, borderTop: '0.5px solid var(--color-border)', paddingTop: 32 }}>
                <ActivityLogComponent
                    applicationId={id}
                    logs={logs}
                    onUpdate={() => getActivityLogs(id).then(setLogs)}
                />
            </div>
        </div>
    )
}