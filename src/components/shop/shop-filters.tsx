'use client'

import type { AccessoryCategory, AccessoryRarity } from '@/types/monster'
import { CategoryFilter, RarityFilter } from './ui'

interface ShopFiltersProps {
  selectedCategory: AccessoryCategory | 'all'
  onCategoryChange: (category: AccessoryCategory | 'all') => void
  selectedRarity: AccessoryRarity | 'all'
  onRarityChange: (rarity: AccessoryRarity | 'all') => void
  rarityCounts?: Record<AccessoryRarity, number>
  showCategoryFilter?: boolean
}

export default function ShopFilters ({
  selectedCategory,
  onCategoryChange,
  selectedRarity,
  onRarityChange,
  rarityCounts,
  showCategoryFilter = true
}: ShopFiltersProps): React.ReactNode {
  return (
    <div className='space-y-6'>
      {/* Category Filter (only for accessories) */}
      {showCategoryFilter && (
        <div className='space-y-3'>
          <h3 className='text-sm font-bold text-slate-700 uppercase tracking-wide'>
            Catégorie
          </h3>
          <CategoryFilter
            selected={selectedCategory}
            onChange={onCategoryChange}
          />
        </div>
      )}

      {/* Rarity Filter */}
      <div className='space-y-3'>
        <h3 className='text-sm font-bold text-slate-700 uppercase tracking-wide'>
          Rareté
        </h3>
        <RarityFilter
          selected={selectedRarity}
          onChange={onRarityChange}
          counts={rarityCounts}
        />
      </div>
    </div>
  )
}
