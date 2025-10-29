import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'

/**
 * Webhook Stripe pour gérer les événements de paiement
 *
 * Cette route écoute les événements Stripe et crédite automatiquement
 * les Koins après un paiement réussi.
 *
 * Configuration requise :
 * 1. Définir STRIPE_WEBHOOK_SECRET dans .env.local
 * 2. Configurer l'URL du webhook dans le dashboard Stripe
 * 3. S'assurer que l'URL est accessible publiquement (tunnel ngrok en dev)
 *
 * @param request - Requête HTTP avec le payload Stripe
 * @returns Confirmation ou erreur
 */
export async function POST (request: Request): Promise<NextResponse> {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (signature === null || signature === undefined) {
      console.error('❌ Missing Stripe signature')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Vérification de la signature Stripe pour sécurité
    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string
      )
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log('✅ Webhook event received:', event.type)

    // Gestion de l'événement de paiement réussi
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any

      // Récupération des métadonnées
      const userId = session.metadata?.userId
      const koinsAmount = session.metadata?.koinsAmount

      if (userId === null || userId === undefined || koinsAmount === null || koinsAmount === undefined) {
        console.error('❌ Missing metadata in session:', session.id)
        return NextResponse.json(
          { error: 'Missing metadata' },
          { status: 400 }
        )
      }

      const amount = parseInt(koinsAmount, 10)

      if (isNaN(amount) || amount <= 0) {
        console.error('❌ Invalid koins amount:', koinsAmount)
        return NextResponse.json(
          { error: 'Invalid amount' },
          { status: 400 }
        )
      }

      console.log(`💰 Crediting ${amount} Koins to user ${String(userId)}`)

      // Crédit des Koins au wallet de l'utilisateur
      // Note: addKoins nécessite l'authentification, on ne peut pas l'appeler directement ici
      // Il faudrait créer une fonction interne qui bypass l'auth ou utiliser l'API MongoDB directement

      try {
        // Import direct pour bypass auth
        const { default: Wallet } = await import('@/db/models/wallet.model')
        const { default: connectDB } = await import('@/db')

        await connectDB()

        const wallet = await Wallet.findOne({ ownerId: userId }).exec()

        if (wallet !== null && wallet !== undefined) {
          wallet.balance = Number(wallet.balance) + Number(amount)
          wallet.markModified('balance')
          await wallet.save()

          console.log(`✅ Successfully credited ${amount} Koins to user ${String(userId)}. New balance: ${String(wallet.balance)}`)
        } else {
          // Créer le wallet s'il n'existe pas
          const newWallet = new Wallet({
            ownerId: userId,
            balance: amount
          })
          await newWallet.save()

          console.log(`✅ Created wallet for user ${String(userId)} with ${amount} Koins`)
        }

        // Revalidation du cache
        const { revalidatePath } = await import('next/cache')
        revalidatePath('/wallet')
      } catch (error) {
        console.error('❌ Error crediting koins:', error)
        return NextResponse.json(
          { error: 'Failed to credit koins' },
          { status: 500 }
        )
      }
    }

    // Autres événements (optionnel)
    if (event.type === 'checkout.session.expired') {
      console.log('⏰ Checkout session expired:', event.data.object.id)
    }

    if (event.type === 'payment_intent.payment_failed') {
      console.log('❌ Payment failed:', event.data.object.id)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
