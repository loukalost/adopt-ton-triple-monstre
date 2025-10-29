import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getAuthInstance } from '@/lib/auth'
import { getWallet } from '@/actions/wallet.actions'
import { getUserInventory } from '@/actions/inventory.actions'
import { SHOP_ACCESSORIES } from '@/config/shop/accessories'
import { SHOP_BACKGROUNDS } from '@/config/shop/backgrounds'
import ShopClient from '@/components/shop/shop-client'

/**
 * Page de la boutique d'accessoires et d'arrière-plans
 * Server Component: Récupère les données côté serveur (wallet + inventory)
 * Délègue la gestion d'état et interactions à ShopClient
 */
export default async function ShopPage (): Promise<React.ReactNode> {
  // Vérifier l'authentification
  const auth = await getAuthInstance()
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session == null) {
    redirect('/sign-in')
  }

  // Récupérer le solde Koins
  const wallet = await getWallet()

  // Récupérer l'inventaire utilisateur
  const inventory = await getUserInventory()

  return (
    <ShopClient
      initialKoins={wallet.balance}
      ownedAccessoryIds={inventory.accessories}
      ownedBackgroundIds={inventory.backgrounds}
      accessories={SHOP_ACCESSORIES}
      backgrounds={SHOP_BACKGROUNDS}
    />
  )
}
