import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  typescript: true
})

export const pricingTable = {
  10: 'prod_TJrIJITcL4IHs3',
  50: 'prod_TJrJcuzsBuRDse',
  500: 'prod_TJrJvU3OyU8HoJ',
  1000: 'prod_TJrK272JmJ5tGA'
}
