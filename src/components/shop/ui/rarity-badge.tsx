import type React from 'react'
import { RARITY_COLORS, RARITY_LABELS, RARITY_ICONS } from '@/config/shop'
import type { AccessoryRarity } from '@/types/monster'

interface RarityBadgeProps {
  rarity: AccessoryRarity
  className?: string
  showIcon?: boolean
}

/**
 * Badge affichant la rareté d'un item
 * Principe SRP: Responsabilité unique d'affichage de la rareté
 * Principe OCP: Ouvert à l'extension via className
 */
export function RarityBadge ({
  rarity,
  className = '',
  showIcon = true
}: RarityBadgeProps): React.ReactElement {
  const colors = RARITY_COLORS[rarity]
  const label = RARITY_LABELS[rarity]
  const icon = RARITY_ICONS[rarity]

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
        ${colors.bg} ${colors.text}
        shadow-sm transition-all duration-200
        ${className}
      `}
    >
      {showIcon && <span className='text-sm'>{icon}</span>}
      <span>{label}</span>
    </span>
  )
}
