'use client'

import { useState, useMemo } from 'react'
import type { ShopAccessory, ShopBackground, AccessoryCategory, AccessoryRarity } from '@/types/monster'
import { purchaseAccessory, purchaseBackground } from '@/actions/inventory.actions'
import { showSuccess, showError } from '@/lib/toast'
import { AppLayout } from '@/components/navigation'
import ShopFilters from './shop-filters'
import ShopGrid from './shop-grid'
import PurchaseModal from './purchase-modal'
import InventoryModal from './inventory-modal'

type TabType = 'accessories' | 'backgrounds'

interface ShopClientProps {
  initialKoins: number
  ownedAccessoryIds: string[]
  ownedBackgroundIds: string[]
  accessories: ShopAccessory[]
  backgrounds: ShopBackground[]
}

/**
 * Client component pour la boutique
 * Gère l'état des filtres, tabs, modals et achats
 * Suit le principe SRP: responsabilité unique de gestion de l'UI shop
 */
export default function ShopClient ({
  initialKoins,
  ownedAccessoryIds,
  ownedBackgroundIds,
  accessories,
  backgrounds
}: ShopClientProps): React.ReactNode {
  // State: Navigation
  const [activeTab, setActiveTab] = useState<TabType>('accessories')

  // State: Filters
  const [selectedCategory, setSelectedCategory] = useState<AccessoryCategory | 'all'>('all')
  const [selectedRarity, setSelectedRarity] = useState<AccessoryRarity | 'all'>('all')

  // State: Modals
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ShopAccessory | ShopBackground | null>(null)

  // State: Purchase flow
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [purchaseError, setPurchaseError] = useState<string | null>(null)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)

  // State: Koins balance (optimistic updates)
  const [currentKoins, setCurrentKoins] = useState(initialKoins)

  // State: Owned items (optimistic updates)
  const [ownedAccessories, setOwnedAccessories] = useState<string[]>(ownedAccessoryIds)
  const [ownedBackgrounds, setOwnedBackgrounds] = useState<string[]>(ownedBackgroundIds)

  // Filtered accessories
  const filteredAccessories = useMemo(() => {
    let result = accessories

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(acc => acc.category === selectedCategory)
    }

    // Filter by rarity
    if (selectedRarity !== 'all') {
      result = result.filter(acc => acc.rarity === selectedRarity)
    }

    return result
  }, [accessories, selectedCategory, selectedRarity])

  // Filtered backgrounds
  const filteredBackgrounds = useMemo(() => {
    let result = backgrounds

    // Filter by rarity only
    if (selectedRarity !== 'all') {
      result = result.filter(bg => bg.rarity === selectedRarity)
    }

    return result
  }, [backgrounds, selectedRarity])

  // Rarity counts for filters
  const rarityCounts = useMemo(() => {
    const items = activeTab === 'accessories' ? filteredAccessories : filteredBackgrounds
    const counts: Record<AccessoryRarity, number> = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0
    }

    items.forEach(item => {
      counts[item.rarity]++
    })

    return counts
  }, [activeTab, filteredAccessories, filteredBackgrounds])

  // Get owned items from active accessories/backgrounds
  const ownedItemsForDisplay = useMemo(() => {
    if (activeTab === 'accessories') {
      return accessories.filter(acc => ownedAccessories.includes(acc.id))
    } else {
      return backgrounds.filter(bg => ownedBackgrounds.includes(bg.id))
    }
  }, [activeTab, accessories, backgrounds, ownedAccessories, ownedBackgrounds])

  // Handle purchase button click (open modal)
  const handlePurchaseClick = async (itemId: string): Promise<void> => {
    const item = activeTab === 'accessories'
      ? accessories.find(a => a.id === itemId)
      : backgrounds.find(b => b.id === itemId)

    if (item == null) return

    setSelectedItem(item)
    setPurchaseModalOpen(true)
    setPurchaseError(null)
    setPurchaseSuccess(false)
  }

  // Handle purchase confirmation
  const handlePurchaseConfirm = async (): Promise<void> => {
    if (selectedItem == null) return

    setIsPurchasing(true)
    setPurchaseError(null)

    try {
      // Call appropriate server action
      if (activeTab === 'accessories') {
        await purchaseAccessory(selectedItem.id)
        // Optimistic update
        setOwnedAccessories(prev => [...prev, selectedItem.id])
      } else {
        await purchaseBackground(selectedItem.id)
        // Optimistic update
        setOwnedBackgrounds(prev => [...prev, selectedItem.id])
      }

      // Update Koins balance
      setCurrentKoins(prev => prev - selectedItem.price)

      // Show success
      setPurchaseSuccess(true)
      showSuccess(`${selectedItem.name} acheté avec succès !`)

      // Reset modal after delay (handled by modal component)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'achat'
      setPurchaseError(errorMessage)
      showError(errorMessage)
    } finally {
      setIsPurchasing(false)
    }
  }

  // Handle modal close
  const handleModalClose = (): void => {
    setPurchaseModalOpen(false)
    setSelectedItem(null)
    setPurchaseError(null)
    setPurchaseSuccess(false)
  }

  // Reset filters when changing tabs
  const handleTabChange = (tab: TabType): void => {
    setActiveTab(tab)
    setSelectedCategory('all')
    setSelectedRarity('all')
  }

  return (
    <AppLayout>
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24'>
        {/* Header */}
        <div className='bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6 shadow-xl'>
          <div className='max-w-7xl mx-auto space-y-4'>
            {/* Title & Balance */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
              <div>
                <h1 className='text-3xl font-bold'>🛒 Boutique d&apos;Accessoires</h1>
                <p className='text-slate-300 text-sm mt-1'>
                  Personnalisez vos monstres avec style
                </p>
              </div>

              <div className='flex items-center gap-4'>
                {/* Inventory Button */}
                <button
                  onClick={() => { setInventoryModalOpen(true) }}
                  className='bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-md hover:shadow-lg active:scale-95'
                >
                  🎒 Inventaire
                </button>

                {/* Koins Balance */}
                <div className='bg-slate-900/50 backdrop-blur px-6 py-3 rounded-2xl border-2 border-amber-400/50 shadow-lg'>
                  <div className='flex items-center gap-2'>
                    <span className='text-3xl'>🪙</span>
                    <div>
                      <p className='text-xs text-slate-400'>Votre solde</p>
                      <p className='text-xl font-bold text-amber-300'>
                        {currentKoins.toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className='flex gap-2'>
              <button
                onClick={() => { handleTabChange('accessories') }}
                className={`
                  flex-1 sm:flex-none sm:px-8 py-3 rounded-xl font-bold transition-all duration-300
                  ${activeTab === 'accessories'
                    ? 'bg-white text-slate-800 shadow-xl scale-105'
                    : 'bg-slate-700/50 text-white hover:bg-slate-600/50'
                  }
                `}
              >
                🎭 Accessoires ({accessories.length})
              </button>
              <button
                onClick={() => { handleTabChange('backgrounds') }}
                className={`
                  flex-1 sm:flex-none sm:px-8 py-3 rounded-xl font-bold transition-all duration-300
                  ${activeTab === 'backgrounds'
                    ? 'bg-white text-slate-800 shadow-xl scale-105'
                    : 'bg-slate-700/50 text-white hover:bg-slate-600/50'
                  }
                `}
              >
                🖼️ Arrière-plans ({backgrounds.length})
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>
          <div className='flex flex-col lg:flex-row gap-8'>
            {/* Sidebar: Filters */}
            <aside className='lg:w-64 flex-shrink-0'>
              <div className='bg-white rounded-2xl shadow-lg p-6 sticky top-4'>
                <ShopFilters
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  selectedRarity={selectedRarity}
                  onRarityChange={setSelectedRarity}
                  rarityCounts={rarityCounts}
                  showCategoryFilter={activeTab === 'accessories'}
                />
              </div>
            </aside>

            {/* Main: Grid */}
            <main className='flex-1 min-w-0'>
              {activeTab === 'accessories'
                ? (
                  <ShopGrid
                    items={filteredAccessories}
                    type='accessory'
                    ownedIds={ownedAccessories}
                    onPurchase={handlePurchaseClick}
                  />
                  )
                : (
                  <ShopGrid
                    items={filteredBackgrounds}
                    type='background'
                    ownedIds={ownedBackgrounds}
                    onPurchase={handlePurchaseClick}
                  />
                  )}
            </main>
          </div>
        </div>

        {/* Modals */}
        <PurchaseModal
          open={purchaseModalOpen}
          item={selectedItem}
          type={activeTab === 'accessories' ? 'accessory' : 'background'}
          currentKoins={currentKoins}
          onConfirm={handlePurchaseConfirm}
          onCancel={handleModalClose}
          isLoading={isPurchasing}
          error={purchaseError}
          success={purchaseSuccess}
        />

        <InventoryModal
          open={inventoryModalOpen}
          onClose={() => { setInventoryModalOpen(false) }}
          accessories={ownedItemsForDisplay.filter((item): item is ShopAccessory => 'category' in item)}
          backgrounds={ownedItemsForDisplay.filter((item): item is ShopBackground => 'gradient' in item)}
        />
      </div>
    </AppLayout>
  )
}
