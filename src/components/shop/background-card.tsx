'use client'

import type { ShopBackground } from '@/types/monster'
import { RarityBadge, BackgroundPreview, PriceTag } from './ui'
import { useState } from 'react'

interface BackgroundCardProps {
  background: ShopBackground
  owned: boolean
  onPurchase: (backgroundId: string) => Promise<void>
  disabled?: boolean
}

export default function BackgroundCard ({
  background,
  owned,
  onPurchase,
  disabled = false
}: BackgroundCardProps): React.ReactNode {
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async (): Promise<void> => {
    if (owned || disabled || isLoading) return

    setIsLoading(true)
    try {
      await onPurchase(background.id)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`
        relative bg-white rounded-2xl shadow-lg ring-2 transition-all duration-300
        ${owned ? 'ring-emerald-300' : 'ring-slate-200 hover:ring-slate-400 hover:shadow-xl'}
        ${background.rarity === 'legendary' ? 'bg-gradient-to-br from-white via-amber-50 to-white' : ''}
      `}
    >
      {/* Owned Badge */}
      {owned && (
        <div className='absolute top-3 right-3 z-10'>
          <div className='bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border-2 border-emerald-300 shadow-sm'>
            ✓ Possédé
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className='p-6 space-y-4'>
        {/* Preview */}
        <BackgroundPreview
          gradient={background.gradient}
          name={background.name}
          size='md'
        />

        {/* Name & Rarity */}
        <div className='text-center space-y-2'>
          <h3 className='text-lg font-bold text-slate-800'>{background.name}</h3>
          <RarityBadge rarity={background.rarity} showIcon />
        </div>

        {/* Description */}
        <p className='text-sm text-slate-600 text-center line-clamp-2 min-h-[40px]'>
          {background.description}
        </p>

        {/* Price */}
        <div className='flex justify-center'>
          <PriceTag price={background.price} size='md' />
        </div>

        {/* Purchase Button */}
        <button
          onClick={() => { void handlePurchase() }}
          disabled={owned || disabled || isLoading}
          className={`
            w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300
            ${owned
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : disabled || isLoading
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-slate-800 text-white hover:bg-slate-900 hover:shadow-lg active:scale-95'
            }
          `}
        >
          {isLoading ? '⏳ Achat en cours...' : owned ? '✓ Déjà possédé' : '🛒 Acheter'}
        </button>
      </div>
    </div>
  )
}
