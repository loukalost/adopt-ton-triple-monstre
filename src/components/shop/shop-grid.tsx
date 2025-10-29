'use client'

import type { ShopAccessory, ShopBackground } from '@/types/monster'
import AccessoryCard from './accessory-card'
import BackgroundCard from './background-card'

interface ShopGridProps {
  items: ShopAccessory[] | ShopBackground[]
  type: 'accessory' | 'background'
  ownedIds: string[]
  onPurchase: (itemId: string) => Promise<void>
  disabled?: boolean
}

export default function ShopGrid ({
  items,
  type,
  ownedIds,
  onPurchase,
  disabled = false
}: ShopGridProps): React.ReactNode {
  if (items.length === 0) {
    return (
      <div className='text-center py-12 space-y-4'>
        <div className='text-6xl'>🔍</div>
        <p className='text-slate-500 text-lg font-medium'>
          Aucun article trouvé
        </p>
        <p className='text-slate-400 text-sm'>
          Essayez de modifier vos filtres
        </p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {items.map((item) => {
        const owned = ownedIds.includes(item.id)

        if (type === 'accessory') {
          return (
            <AccessoryCard
              key={item.id}
              accessory={item as ShopAccessory}
              owned={owned}
              onPurchase={onPurchase}
              disabled={disabled}
            />
          )
        } else {
          return (
            <BackgroundCard
              key={item.id}
              background={item as ShopBackground}
              owned={owned}
              onPurchase={onPurchase}
              disabled={disabled}
            />
          )
        }
      })}
    </div>
  )
}
