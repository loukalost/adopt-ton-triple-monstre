import type React from 'react'
import { Card } from './ui/card'

interface Feature {
  icon: string
  title: string
  text: string
}

const features: Feature[] = [
  { icon: '🔒', title: 'Paiement Sécurisé', text: 'Crypté SSL via Stripe' },
  { icon: '⚡', title: 'Instantané', text: 'Koins ajoutés immédiatement' },
  { icon: '💳', title: 'Tous moyens', text: 'CB, PayPal, Apple Pay...' }
]

/**
 * Composant d'affichage des fonctionnalités de paiement - Thème SLATE
 * Principe SRP: Responsabilité unique d'affichage des features
 *
 * Couleurs adaptées au thème SLATE:
 * - Titres: slate-700 au lieu de purple-600
 * - Texte: slate-600
 */
export function PaymentFeatures (): React.ReactElement {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      {features.map((feature, index) => (
        <Card key={index} hover>
          <div className='text-center'>
            <div className='text-5xl mb-3'>{feature.icon}</div>
            <h3 className='text-xl font-black text-slate-700 mb-2'>{feature.title}</h3>
            <p className='text-slate-600 font-medium'>{feature.text}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
