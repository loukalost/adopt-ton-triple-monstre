import type React from 'react'

interface BackgroundPreviewProps {
  gradient: string
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Preview d'un arrière-plan avec gradient
 * Principe SRP: Responsabilité unique d'affichage de preview
 */
export function BackgroundPreview ({
  gradient,
  name,
  size = 'md',
  className = ''
}: BackgroundPreviewProps): React.ReactElement {
  const sizeClasses = {
    sm: 'h-20 w-32',
    md: 'h-32 w-48',
    lg: 'h-48 w-64'
  }

  return (
    <div
      className={`
        relative rounded-xl overflow-hidden
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <div
        className={`
          absolute inset-0
          bg-gradient-to-br ${gradient}
          transition-transform duration-300 hover:scale-105
        `}
      />
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg'>
          <p className='text-white font-bold text-sm text-center'>{name}</p>
        </div>
      </div>
    </div>
  )
}
