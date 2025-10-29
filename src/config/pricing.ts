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
    productId: 'prod_TJrIjoHwTKwg9c',
    price: 5 // 5€ pour 10 Koins
  },
  50: {
    productId: 'prod_TJrJHiNKtOkEXR',
    price: 20 // 20€ pour 50 Koins
  },
  500: {
    productId: 'prod_TJrJT9hFwWozod',
    price: 150 // 150€ pour 500 Koins
  },
  1000: {
    productId: 'prod_TJrKh3jSiA5EQ5',
    price: 200 // 200€ pour 1000 Koins
  },
  5000: {
    productId: 'prod_TJrLUfvqFCZx8l',
    price: 800 // 800€ pour 5000 Koins
  }
}
