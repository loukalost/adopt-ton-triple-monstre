import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { pricingTable } from '@/config/pricing'
import { getAuthInstance } from '@/lib/auth'
import { headers } from 'next/headers'

/**
 * API Route pour créer une session Stripe Checkout
 *
 * Cette route gère la création de sessions de paiement Stripe
 * pour l'achat de Koins.
 *
 * @param request - Requête HTTP contenant le montant de Koins à acheter
 * @returns URL de redirection vers Stripe Checkout ou erreur
 */
export async function POST (request: Request): Promise<NextResponse> {
  try {
    // Vérification de l'authentification
    const auth = await getAuthInstance()
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupération du montant depuis le body
    const { amount } = await request.json() as { amount: number }

    // Validation du montant
    if (!(amount in pricingTable)) {
      return NextResponse.json(
        { error: 'Montant invalide' },
        { status: 400 }
      )
    }

    const { price } = pricingTable[amount]

    // Création de la session Stripe Checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: price * 100, // Conversion en centimes
            product_data: {
              name: `${amount} Koins`,
              description: `Pack de ${amount} Koins pour Adopt ton triple monstre`,
              images: ['https://adopt-ton-triple-monstre.vercel.app/logo_comp.webp']
            }
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/wallet?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/wallet?canceled=true`,
      metadata: {
        userId: session.user.id,
        koinsAmount: amount.toString()
      }
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session' },
      { status: 500 }
    )
  }
}
