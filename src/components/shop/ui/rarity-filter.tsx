'use client'

import type React from 'react'
import { RARITY_LABELS, RARITY_ICONS, RARITY_COLORS } from '@/config/shop'
import type { AccessoryRarity } from '@/types/monster'

interface RarityFilterProps {
  selected: AccessoryRarity | 'all'
  onChange: (rarity: AccessoryRarity | 'all') => void
  counts?: Partial<Record<AccessoryRarity, number>>
  className?: string
}

const RARITIES: Array<{ id: AccessoryRarity | 'all', label: string }> = [
  { id: 'all', label: 'Toutes' },
  { id: 'common', label: RARITY_LABELS.common },
  { id: 'rare', label: RARITY_LABELS.rare },
  { id: 'epic', label: RARITY_LABELS.epic },
  { id: 'legendary', label: RARITY_LABELS.legendary }
]

/**
 * Filtres par rareté avec compteurs
 * Principe SRP: Responsabilité unique de gestion des filtres de rareté
 */
export function RarityFilter ({
  selected,
  onChange,
  counts = {},
  className = ''
}: RarityFilterProps): React.ReactElement {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {RARITIES.map((rarity) => {
        const isSelected = selected === rarity.id
        const count = rarity.id === 'all' ? undefined : counts[rarity.id]
        const colors = rarity.id !== 'all' ? RARITY_COLORS[rarity.id] : null
        const icon = rarity.id !== 'all' ? RARITY_ICONS[rarity.id] : '✨'

        return (
          <button
            key={rarity.id}
            onClick={() => { onChange(rarity.id) }}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm
              transition-all duration-200
              flex items-center gap-2
              ${
                isSelected
                  ? colors !== null
                    ? `${colors.bg} ${colors.text} shadow-lg scale-105`
                    : 'bg-slate-800 text-white shadow-lg scale-105'
                  : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-400 hover:shadow-md'
              }
            `}
          >
            <span className='text-base'>{icon}</span>
            <span>{rarity.label}</span>
            {count !== null && count !== undefined && (
              <span
                className={`
                  ml-1 px-2 py-0.5 rounded-full text-xs font-bold
                  ${isSelected ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}
                `}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
