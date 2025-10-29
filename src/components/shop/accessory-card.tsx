'use client'

import type { ShopAccessory } from '@/types/monster'
import { RarityBadge, AccessoryIcon, PriceTag } from './ui'
import { useState } from 'react'

interface AccessoryCardProps {
  accessory: ShopAccessory
  owned: boolean
  onPurchase: (accessoryId: string) => Promise<void>
  disabled?: boolean
}

export default function AccessoryCard ({
  accessory,
  owned,
  onPurchase,
  disabled = false
}: AccessoryCardProps): React.ReactNode {
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async (): Promise<void> => {
    if (owned || disabled || isLoading) return

    setIsLoading(true)
    try {
      await onPurchase(accessory.id)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`
        relative bg-white rounded-2xl shadow-lg ring-2 transition-all duration-300
        ${owned ? 'ring-emerald-300' : 'ring-slate-200 hover:ring-slate-400 hover:shadow-xl'}
        ${accessory.rarity === 'legendary' ? 'bg-gradient-to-br from-white via-amber-50 to-white' : ''}
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
        {/* Icon */}
        <div className='flex justify-center'>
          <AccessoryIcon emoji={accessory.emoji} size='lg' animated />
        </div>

        {/* Name & Category */}
        <div className='text-center space-y-2'>
          <h3 className='text-lg font-bold text-slate-800'>{accessory.name}</h3>
          <RarityBadge rarity={accessory.rarity} showIcon />
        </div>

        {/* Description */}
        <p className='text-sm text-slate-600 text-center line-clamp-2 min-h-[40px]'>
          {accessory.description}
        </p>

        {/* Price */}
        <div className='flex justify-center'>
          <PriceTag price={accessory.price} size='md' />
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
