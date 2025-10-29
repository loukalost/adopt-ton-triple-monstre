'use client'

import type { ShopAccessory, ShopBackground } from '@/types/monster'
import { AccessoryIcon, BackgroundPreview, PriceTag, RarityBadge } from './ui'
import { useEffect } from 'react'

interface PurchaseModalProps {
  open: boolean
  item: ShopAccessory | ShopBackground | null
  type: 'accessory' | 'background'
  currentKoins: number
  onConfirm: () => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  error?: string | null
  success?: boolean
}

export default function PurchaseModal ({
  open,
  item,
  type,
  currentKoins,
  onConfirm,
  onCancel,
  isLoading = false,
  error = null,
  success = false
}: PurchaseModalProps): React.ReactNode {
  // Close modal on success after delay
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onCancel()
      }, 2000)
      return () => { clearTimeout(timer) }
    }
  }, [success, onCancel])

  if (!open || (item == null)) return null

  const canAfford = currentKoins >= item.price
  const isAccessory = type === 'accessory'

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in'>
      <div className='bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6 animate-scale-in'>
        {/* Success State */}
        {success && (
          <div className='text-center space-y-4'>
            <div className='text-6xl'>✅</div>
            <h2 className='text-2xl font-bold text-emerald-600'>
              Achat réussi !
            </h2>
            <p className='text-slate-600'>
              L'article a été ajouté à votre inventaire
            </p>
          </div>
        )}

        {/* Purchase Form */}
        {!success && (
          <>
            {/* Header */}
            <div className='text-center space-y-2'>
              <h2 className='text-2xl font-bold text-slate-800'>
                Confirmer l'achat
              </h2>
              <p className='text-sm text-slate-500'>
                Êtes-vous sûr de vouloir acheter cet article ?
              </p>
            </div>

            {/* Item Preview */}
            <div className='bg-slate-50 rounded-2xl p-6 space-y-4'>
              {/* Icon/Preview */}
              <div className='flex justify-center'>
                {isAccessory
                  ? (
                    <AccessoryIcon
                      emoji={(item as ShopAccessory).emoji}
                      size='xl'
                    />
                    )
                  : (
                    <BackgroundPreview
                      gradient={(item as ShopBackground).gradient}
                      name={item.name}
                      size='lg'
                    />
                    )}
              </div>

              {/* Name & Rarity */}
              <div className='text-center space-y-2'>
                <h3 className='text-xl font-bold text-slate-800'>{item.name}</h3>
                <RarityBadge rarity={item.rarity} showIcon />
              </div>

              {/* Price */}
              <div className='flex justify-center'>
                <PriceTag price={item.price} size='lg' />
              </div>
            </div>

            {/* Balance Info */}
            <div className='bg-slate-100 rounded-xl p-4 space-y-2'>
              <div className='flex justify-between text-sm'>
                <span className='text-slate-600'>Solde actuel:</span>
                <span className='font-bold text-slate-800'>
                  🪙 {currentKoins.toLocaleString('fr-FR')} Koins
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-slate-600'>Après achat:</span>
                <span className={`font-bold ${canAfford ? 'text-emerald-600' : 'text-red-600'}`}>
                  🪙 {(currentKoins - item.price).toLocaleString('fr-FR')} Koins
                </span>
              </div>
            </div>

            {/* Error Message */}
            {(error != null && error !== '') && (
              <div className='bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center'>
                <p className='text-red-600 text-sm font-medium'>
                  ❌ {error}
                </p>
              </div>
            )}

            {/* Insufficient Funds Warning */}
            {!canAfford && (
              <div className='bg-amber-50 border-2 border-amber-200 rounded-xl p-4 text-center'>
                <p className='text-amber-700 text-sm font-medium'>
                  ⚠️ Koins insuffisants
                </p>
              </div>
            )}

            {/* Actions */}
            <div className='flex gap-3'>
              <button
                onClick={onCancel}
                disabled={isLoading}
                className='flex-1 py-3 px-4 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Annuler
              </button>
              <button
                onClick={() => { void onConfirm() }}
                disabled={isLoading || !canAfford}
                className='flex-1 py-3 px-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 hover:shadow-lg active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? '⏳ Achat...' : '✓ Confirmer'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
