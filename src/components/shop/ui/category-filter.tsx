'use client'

import type React from 'react'
import type { AccessoryCategory } from '@/types/monster'

interface CategoryFilterProps {
  selected: 'all' | AccessoryCategory
  onChange: (category: 'all' | AccessoryCategory) => void
  className?: string
}

const CATEGORIES = [
  { id: 'all' as const, label: 'Tous', icon: '🛍️' },
  { id: 'hat' as const, label: 'Chapeaux', icon: '🎩' },
  { id: 'glasses' as const, label: 'Lunettes', icon: '👓' },
  { id: 'shoes' as const, label: 'Chaussures', icon: '👟' }
]

/**
 * Filtres par catégorie d'accessoires
 * Principe SRP: Responsabilité unique de gestion des filtres de catégorie
 */
export function CategoryFilter ({
  selected,
  onChange,
  className = ''
}: CategoryFilterProps): React.ReactElement {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {CATEGORIES.map((category) => {
        const isSelected = selected === category.id

        return (
          <button
            key={category.id}
            onClick={() => { onChange(category.id) }}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm
              transition-all duration-200
              flex items-center gap-2
              ${
                isSelected
                  ? 'bg-slate-800 text-white shadow-lg scale-105'
                  : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-400 hover:shadow-md'
              }
            `}
          >
            <span className='text-lg'>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        )
      })}
    </div>
  )
}
