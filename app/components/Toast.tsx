'use client'

import { useEffect } from 'react'

type Props = {
  message: string
  type?: 'success' | 'error'
  onClose: () => void
}

export default function Toast({ message, type = 'success', onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 100,
      background: type === 'success' ? '#EAF3DE' : '#FCEBEB',
      color: type === 'success' ? '#3B6D11' : '#A32D2D',
      border: `0.5px solid ${type === 'success' ? '#97C459' : '#F09595'}`,
      borderRadius: 8,
      padding: '12px 18px',
      fontSize: 13,
      fontWeight: 500,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      animation: 'slideUp 0.2s ease',
    }}>
      {message}
    </div>
  )
}