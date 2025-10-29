import type React from 'react'

interface PriceTagProps {
  price: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Affichage du prix avec icône Koin
 * Principe SRP: Responsabilité unique d'affichage du prix
 */
export function PriceTag ({
  price,
  className = '',
  size = 'md'
}: PriceTagProps): React.ReactElement {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  }

  const iconSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl'
  }

  return (
    <div
      className={`
        inline-flex items-center gap-2 font-bold text-slate-700
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <span className={iconSizes[size]}>🪙</span>
      <span>{price.toLocaleString('fr-FR')}</span>
      <span className='text-slate-500 font-medium'>Koins</span>
    </div>
  )
}
