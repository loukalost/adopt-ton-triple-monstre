import type React from 'react'

interface AccessoryIconProps {
  emoji: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  animated?: boolean
}

/**
 * Affichage d'un emoji d'accessoire avec effets hover
 * Principe SRP: Responsabilité unique d'affichage d'icône
 */
export function AccessoryIcon ({
  emoji,
  size = 'md',
  className = '',
  animated = true
}: AccessoryIconProps): React.ReactElement {
  const sizeClasses = {
    sm: 'text-3xl',
    md: 'text-5xl',
    lg: 'text-7xl',
    xl: 'text-9xl'
  }

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${animated ? 'transform transition-transform duration-300 hover:scale-110' : ''}
        ${className}
      `}
    >
      {emoji}
    </div>
  )
}
