'use client'

import type { DBWallet } from '@/types/wallet'
import { useState, useEffect } from 'react'
import type React from 'react'
import { usePaymentModal } from '@/hooks/wallet/usePaymentModal'
import { useWalletPayment } from '@/hooks/wallet/useWalletPayment'
import { walletPackages } from '@/config/wallet-packages'
import { DecorativeBackground } from './ui/decorative-background'
import { WalletBalance } from './wallet-balance'
import { KoinPackageCard } from './koin-package-card'
import { PaymentFeatures } from './payment-features'
import PaymentModal from './payment-modal'
import { AnimatedEmoji } from './ui/animated-emoji'

interface WalletClientProps {
  initialWallet: DBWallet
}

/**
 * Composant client pour afficher et gérer le wallet de l'utilisateur - Version SLATE Professionnelle
 *
 * Fonctionnalités :
 * - Affichage du solde de Koins avec animations modernes
 * - Cartes d'achat de Koins via Stripe avec design professionnel
 * - Architecture modulaire avec composants SOLID
 * - Design SLATE avec accents amber
 *
 * @param {WalletClientProps} props - Les propriétés du composant
 * @param {DBWallet} props.initialWallet - Le wallet initial de l'utilisateur
 */
export default function WalletClient ({ initialWallet }: WalletClientProps): React.ReactElement {
  const [wallet, setWallet] = useState<DBWallet>(initialWallet)
  const { modalType, closeModal } = usePaymentModal()
  const { isPurchasing, error, handlePurchase, clearError } = useWalletPayment()

  // Synchroniser le wallet quand initialWallet change (après revalidation serveur)
  useEffect(() => {
    setWallet(initialWallet)
    console.log('Wallet mis à jour :', initialWallet)
  }, [initialWallet])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden'>
      {/* Éléments décoratifs flottants */}
      <DecorativeBackground />

      <div className='relative max-w-6xl mx-auto'>
        {/* En-tête professionnel */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-4 mb-6'>
            <AnimatedEmoji emoji='💰' size='2xl' animation='bounce' />
            <h1 className='text-6xl font-black text-transparent bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 bg-clip-text'>
              Boutique de Koins
            </h1>
            <AnimatedEmoji emoji='🪙' size='2xl' animation='bounce' />
          </div>
          <p className='text-2xl font-bold text-slate-600 flex items-center justify-center gap-3'>
            <span className='text-3xl'>💎</span>
            Investis dans ton aventure !
            <span className='text-3xl'>💎</span>
          </p>
        </div>

        {/* Carte du solde actuel */}
        <div className='mb-12'>
          <WalletBalance balance={wallet.balance} />
        </div>

        {/* Message d'erreur */}
        {error !== null && (
          <div className='mb-8 p-6 bg-gradient-to-r from-red-100 to-rose-100 border-4 border-red-300 rounded-3xl shadow-xl'>
            <p className='text-center text-red-700 font-bold text-xl flex items-center justify-center gap-3'>
              <span className='text-3xl'>⚠️</span>
              {error}
              <span className='text-3xl'>⚠️</span>
            </p>
            <button
              onClick={clearError}
              className='mt-4 mx-auto block px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors'
            >
              Fermer
            </button>
          </div>
        )}

        {/* Section boutique */}
        <div className='text-center mb-8'>
          <h2 className='text-5xl font-black text-transparent bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text mb-4'>
            Choisis ton Pack de Koins ! 🎁
          </h2>
          <p className='text-xl text-slate-700 font-bold'>
            Paiement sécurisé par Stripe 🔒
          </p>
        </div>

        {/* Grille des packages */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
          {walletPackages.map((pkg) => (
            <KoinPackageCard
              key={pkg.amount}
              package={pkg}
              onPurchase={(amount: number) => { void handlePurchase(amount) }}
              isPurchasing={isPurchasing}
            />
          ))}
        </div>

        {/* Footer informatif */}
        <PaymentFeatures />
      </div>

      {/* Modal de paiement */}
      {modalType !== null && (
        <PaymentModal
          type={modalType}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
