'use client'
import React from 'react'

interface MonsterModalProps {
  children: React.ReactNode
  open: boolean
  onClose: () => void
}

function MonsterModal ({ children, open, onClose }: MonsterModalProps): React.ReactNode {
  if (!open) return null

  const handleContentClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation()
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'
      role='dialog'
      aria-modal='true'
      onClick={onClose}
    >
      <div
        className='relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl'
        onClick={handleContentClick}
      >
        <button
          type='button'
          aria-label='Fermer'
          className='absolute right-4 top-4 text-gray-500 transition-colors duration-300 hover:text-gray-700'
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

export default MonsterModal
