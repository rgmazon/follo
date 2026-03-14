import type { ApplicationStatus } from '@/lib/applications'

const styles: Record<ApplicationStatus, { background: string; color: string }> = {
  applied:      { background: '#E6F1FB', color: '#185FA5' },
  phone_screen: { background: '#FAEEDA', color: '#854F0B' },
  interview:    { background: '#EEEDFE', color: '#534AB7' },
  offer:        { background: '#EAF3DE', color: '#3B6D11' },
  rejected:     { background: '#F1EFE8', color: '#5F5E5A' },
  withdrawn:    { background: '#F1EFE8', color: '#5F5E5A' },
}

const labels: Record<ApplicationStatus, string> = {
  applied:      'Applied',
  phone_screen: 'Phone screen',
  interview:    'Interview',
  offer:        'Offer',
  rejected:     'Rejected',
  withdrawn:    'Withdrawn',
}

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  const style = styles[status]
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 9px',
      borderRadius: 20,
      fontSize: 11,
      fontFamily: 'var(--font-dm-mono)',
      fontWeight: 500,
      letterSpacing: '0.04em',
      background: style.background,
      color: style.color,
    }}>
      {labels[status]}
    </span>
  )
}