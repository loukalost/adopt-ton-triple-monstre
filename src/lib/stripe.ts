import Stripe from 'stripe'

/**
 * Instance Stripe configurée avec la clé secrète
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  typescript: true,
  apiVersion: '2025-09-30.clover'
})
