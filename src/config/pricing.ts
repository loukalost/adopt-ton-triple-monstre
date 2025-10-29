/**
 * Table de tarification pour les packages de Koins
 *
 * Configuration des différents montants disponibles à l'achat
 * avec leurs prix et identifiants de produits Stripe.
 */

export interface PricingEntry {
  productId: string
  price: number // Prix en euros
}

export const pricingTable: Record<number, PricingEntry> = {
  10: {
    productId: 'prod_TJrIJITcL4IHs3',
    price: 5 // 5€ pour 10 Koins
  },
  50: {
    productId: 'prod_TJrJcuzsBuRDse',
    price: 20 // 20€ pour 50 Koins
  },
  500: {
    productId: 'prod_TJrJvU3OyU8HoJ',
    price: 150 // 150€ pour 500 Koins
  },
  1000: {
    productId: 'prod_TJrK272JmJ5tGA',
    price: 200 // 200€ pour 1000 Koins
  }
}
