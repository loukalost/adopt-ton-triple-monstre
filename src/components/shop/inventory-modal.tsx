'use client'

import type { ShopAccessory, ShopBackground, AccessoryCategory } from '@/types/monster'
import { AccessoryIcon, BackgroundPreview, RarityBadge } from './ui'
import { useState } from 'react'

interface InventoryModalProps {
  open: boolean
  onClose: () => void
  accessories: ShopAccessory[]
  backgrounds: ShopBackground[]
}

type TabType = 'accessories' | 'backgrounds'

export default function InventoryModal ({
  open,
  onClose,
  accessories,
  backgrounds
}: InventoryModalProps): React.ReactNode {
  const [activeTab, setActiveTab] = useState<TabType>('accessories')
  const [activeCategory, setActiveCategory] = useState<AccessoryCategory | 'all'>('all')

  if (!open) return null

  // Filter accessories by category
  const filteredAccessories = activeCategory === 'all'
    ? accessories
    : accessories.filter(acc => acc.category === activeCategory)

  const getCategoryIcon = (category: AccessoryCategory): string => {
    const icons: Record<AccessoryCategory, string> = {
      hat: '🎩',
      glasses: '👓',
      shoes: '👟'
    }
    return icons[category]
  }

  const getCategoryLabel = (category: AccessoryCategory): string => {
    const labels: Record<AccessoryCategory, string> = {
      hat: 'Chapeaux',
      glasses: 'Lunettes',
      shoes: 'Chaussures'
    }
    return labels[category]
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in'>
      <div className='bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in flex flex-col'>
        {/* Header */}
        <div className='bg-gradient-to-r from-slate-800 to-slate-700 p-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold text-white'>
              🎒 Mon Inventaire
            </h2>
            <button
              onClick={onClose}
              className='text-white hover:bg-white/20 rounded-full p-2 transition-all'
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className='flex gap-2'>
            <button
              onClick={() => { setActiveTab('accessories') }}
              className={`
                flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300
                ${activeTab === 'accessories'
                  ? 'bg-white text-slate-800 shadow-lg'
                  : 'bg-slate-700/50 text-white hover:bg-slate-600/50'
                }
              `}
            >
              🎭 Accessoires ({accessories.length})
            </button>
            <button
              onClick={() => { setActiveTab('backgrounds') }}
              className={`
                flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300
                ${activeTab === 'backgrounds'
                  ? 'bg-white text-slate-800 shadow-lg'
                  : 'bg-slate-700/50 text-white hover:bg-slate-600/50'
                }
              `}
            >
              🖼️ Arrière-plans ({backgrounds.length})
            </button>
          </div>
        </div>

        {/* Category Filter (for accessories) */}
        {activeTab === 'accessories' && (
          <div className='p-4 bg-slate-50 border-b border-slate-200'>
            <div className='flex gap-2 flex-wrap'>
              <button
                onClick={() => { setActiveCategory('all') }}
                className={`
                  py-2 px-4 rounded-lg font-medium text-sm transition-all
                  ${activeCategory === 'all'
                    ? 'bg-slate-800 text-white shadow-md'
                    : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-400'
                  }
                `}
              >
                🛍️ Tous ({accessories.length})
              </button>
              {(['hat', 'glasses', 'shoes'] as AccessoryCategory[]).map((cat) => {
                const count = accessories.filter(acc => acc.category === cat).length
                return (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat) }}
                    className={`
                      py-2 px-4 rounded-lg font-medium text-sm transition-all
                      ${activeCategory === cat
                        ? 'bg-slate-800 text-white shadow-md'
                        : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-400'
                      }
                    `}
                  >
                    {getCategoryIcon(cat)} {getCategoryLabel(cat)} ({count})
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-6'>
          {/* Accessories View */}
          {activeTab === 'accessories' && (
            <>
              {filteredAccessories.length === 0
                ? (
                  <div className='text-center py-12 space-y-4'>
                    <div className='text-6xl'>📭</div>
                    <p className='text-slate-500 text-lg font-medium'>
                      Aucun accessoire
                    </p>
                    <p className='text-slate-400 text-sm'>
                      Visitez la boutique pour acheter des accessoires
                    </p>
                  </div>
                  )
                : (
                  <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {filteredAccessories.map((accessory) => (
                      <div
                        key={accessory.id}
                        className='bg-white rounded-xl shadow-md ring-2 ring-slate-200 p-4 space-y-3 hover:ring-slate-400 hover:shadow-lg transition-all'
                      >
                        <div className='flex justify-center'>
                          <AccessoryIcon emoji={accessory.emoji} size='md' />
                        </div>
                        <div className='text-center space-y-1'>
                          <h4 className='font-bold text-slate-800 text-sm'>
                            {accessory.name}
                          </h4>
                          <RarityBadge rarity={accessory.rarity} showIcon />
                        </div>
                      </div>
                    ))}
                  </div>
                  )}
            </>
          )}

          {/* Backgrounds View */}
          {activeTab === 'backgrounds' && (
            <>
              {backgrounds.length === 0
                ? (
                  <div className='text-center py-12 space-y-4'>
                    <div className='text-6xl'>📭</div>
                    <p className='text-slate-500 text-lg font-medium'>
                      Aucun arrière-plan
                    </p>
                    <p className='text-slate-400 text-sm'>
                      Visitez la boutique pour acheter des arrière-plans
                    </p>
                  </div>
                  )
                : (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {backgrounds.map((background) => (
                      <div
                        key={background.id}
                        className='bg-white rounded-xl shadow-md ring-2 ring-slate-200 p-4 space-y-3 hover:ring-slate-400 hover:shadow-lg transition-all'
                      >
                        <BackgroundPreview
                          gradient={background.gradient}
                          name={background.name}
                          size='md'
                        />
                        <div className='text-center space-y-1'>
                          <h4 className='font-bold text-slate-800 text-sm'>
                            {background.name}
                          </h4>
                          <RarityBadge rarity={background.rarity} showIcon />
                        </div>
                      </div>
                    ))}
                  </div>
                  )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className='p-4 bg-slate-50 border-t border-slate-200'>
          <button
            onClick={onClose}
            className='w-full py-3 px-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 hover:shadow-lg active:scale-95 transition-all'
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
