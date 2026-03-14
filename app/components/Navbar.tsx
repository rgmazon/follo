'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  if (pathname === '/login') return null

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 28px',
      borderBottom: '0.5px solid var(--color-border)',
      background: 'var(--color-surface)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <Link href="/applications" style={{ textDecoration: 'none' }}>
        <span style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 20,
          fontWeight: 400,
          color: 'var(--color-text)',
          letterSpacing: '-0.3px',
        }}>
          Follo
          <span style={{
            fontSize: 11,
            fontFamily: 'var(--font-dm-mono)',
            color: 'var(--color-text-faint)',
            marginLeft: 10,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            verticalAlign: 'middle',
          }}>
            {/* job tracker */}
          </span>
        </span>
      </Link>

      <button
        onClick={handleSignOut}
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
        Sign out
      </button>
    </nav>
  )
}