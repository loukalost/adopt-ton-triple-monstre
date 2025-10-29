'use client'

import type { DBWallet } from '@/types/wallet'
import { useState, useEffect } from 'react'
import type React from 'react'
import { pricingTable } from '@/config/pricing'

interface WalletClientProps {
  initialWallet: DBWallet
}

/**
 * Composant client pour afficher et gérer le wallet de l'utilisateur - Version Jeu Vidéo Fun
 *
 * Fonctionnalités :
 * - Affichage du solde de Koins avec animations spectaculaires
 * - Cartes d'achat de Koins via Stripe
 * - Animations de particules explosives
 * - Design kawaii et engageant
 *
 * @param {WalletClientProps} props - Les propriétés du composant
 * @param {DBWallet} props.initialWallet - Le wallet initial de l'utilisateur
 */
export default function WalletClient ({ initialWallet }: WalletClientProps): React.ReactElement {
  const [wallet] = useState<DBWallet>(initialWallet)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Vérifier les paramètres URL pour afficher un message de succès
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === 'true') {
      setSuccessMessage('🎉 Paiement réussi ! Tes Koins seront crédités dans quelques instants.')
      // Nettoyer l'URL après 5 secondes
      setTimeout(() => {
        window.history.replaceState({}, '', '/wallet')
        setSuccessMessage(null)
      }, 5000)
    } else if (params.get('canceled') === 'true') {
      setError('❌ Paiement annulé. Aucun montant n\'a été débité.')
      setTimeout(() => {
        window.history.replaceState({}, '', '/wallet')
        setError(null)
      }, 5000)
    }
  }, [])

  /**
   * Gère l'achat de Koins via Stripe
   * @param amount - Montant de Koins à acheter
   */
  const handlePurchase = async (amount: number): Promise<void> => {
    setIsPurchasing(true)
    setError(null)

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      })

      const { url } = await response.json()

      if (url !== null && url !== undefined && url !== '') {
        window.location.href = url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'achat de Koins')
      setIsPurchasing(false)
    }
  }

  // Packages d'achat avec leurs caractéristiques
  const packages = [
    {
      amount: 10,
      price: pricingTable[10].price,
      emoji: '🪙',
      color: 'from-yellow-400 to-orange-500',
      badge: 'Débutant',
      popular: false
    },
    {
      amount: 50,
      price: pricingTable[50].price,
      emoji: '💰',
      color: 'from-orange-400 to-red-500',
      badge: 'Populaire',
      popular: true
    },
    {
      amount: 500,
      price: pricingTable[500].price,
      emoji: '💎',
      color: 'from-blue-400 to-cyan-500',
      badge: 'Pro',
      popular: false
    },
    {
      amount: 1000,
      price: pricingTable[1000].price,
      emoji: '👑',
      color: 'from-purple-400 to-pink-500',
      badge: 'Royal',
      popular: false
    },
    {
      amount: 5000,
      price: pricingTable[5000].price,
      emoji: '🌟',
      color: 'from-pink-400 to-rose-500',
      badge: 'Légendaire',
      popular: false
    }
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden'>
      {/* Éléments décoratifs flottants */}
      <div className='pointer-events-none fixed inset-0'>
        <div className='absolute -right-32 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-400/30 blur-3xl animate-float' />
        <div className='absolute -left-32 bottom-20 h-96 w-96 rounded-full bg-gradient-to-br from-pink-300/30 to-purple-400/30 blur-3xl animate-float-delayed' />
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-gradient-to-br from-orange-300/20 to-red-400/20 blur-3xl animate-pulse-slow' />
      </div>

      {/* Étoiles décoratives */}
      <div className='pointer-events-none fixed top-20 right-40 text-6xl animate-twinkle'>⭐</div>
      <div className='pointer-events-none fixed top-40 left-20 text-5xl animate-twinkle-delayed'>💎</div>
      <div className='pointer-events-none fixed bottom-40 right-60 text-6xl animate-twinkle'>🪙</div>

      <div className='relative max-w-6xl mx-auto'>
        {/* En-tête ultra fun */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-4 mb-6'>
            <span className='text-7xl animate-bounce'>💰</span>
            <h1 className='text-6xl font-black text-transparent bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text'>
              Boutique de Koins
            </h1>
            <span className='text-7xl animate-bounce' style={{ animationDelay: '0.2s' }}>🪙</span>
          </div>
          <p className='text-2xl font-bold text-orange-600 flex items-center justify-center gap-3'>
            <span className='text-3xl'>✨</span>
            Achète des Koins pour ton aventure !
            <span className='text-3xl'>✨</span>
          </p>
        </div>

        {/* Carte du solde actuel */}
        <div className='relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-white via-yellow-50 to-orange-100 p-12 mb-12 shadow-[0_30px_90px_rgba(0,0,0,0.25)] ring-8 ring-white/80'>
          <div className='text-center'>
            <p className='text-2xl font-black text-gray-700 mb-6 uppercase tracking-wide'>
              💼 Ton Solde Actuel
            </p>
            <div className='flex items-center justify-center gap-6'>
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-50 animate-pulse-slow' />
                <h2 className='text-9xl font-black text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text drop-shadow-2xl'>
                  {wallet.balance.toLocaleString('fr-FR')}
                </h2>
                <span className='text-8xl animate-spin-slow' style={{ animationDelay: '1s' }}>🪙</span>
              </div>
            </div>
            <div className='mt-6'>
              <div className='inline-flex items-center gap-3 px-8 py-4 rounded-3xl bg-gradient-to-r from-purple-100 to-pink-100 ring-4 ring-purple-200/50 shadow-xl'>
                <span className='text-3xl'>🎮</span>
                <p className='text-3xl font-black text-orange-600 mt-6'>
                  {wallet.balance === 0 && 'Koin'}
                  {wallet.balance === 1 && 'Koin'}
                  {wallet.balance > 1 && 'Koins'}
                </p>
                <span className='text-3xl'>🎮</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message de succès */}
        {successMessage !== null && (
          <div className='mb-8 p-6 bg-gradient-to-r from-green-100 to-emerald-100 border-4 border-green-300 rounded-3xl shadow-xl animate-bounce'>
            <p className='text-center text-green-700 font-bold text-xl flex items-center justify-center gap-3'>
              <span className='text-3xl'>✅</span>
              {successMessage}
              <span className='text-3xl'>✨</span>
            </p>
          </div>
        )}

        {/* Message d'erreur */}
        {error !== null && (
          <div className='mb-8 p-6 bg-gradient-to-r from-red-100 to-rose-100 border-4 border-red-300 rounded-3xl shadow-xl'>
            <p className='text-center text-red-700 font-bold text-xl flex items-center justify-center gap-3'>
              <span className='text-3xl'>⚠️</span>
              {error}
              <span className='text-3xl'>⚠️</span>
            </p>
          </div>
        )}

        {/* Section boutique */}
        <div className='text-center mb-8'>
          <h2 className='text-5xl font-black text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text mb-4'>
            Choisis ton Pack de Koins ! 🎁
          </h2>
          <p className='text-xl text-gray-700 font-bold'>
            Paiement sécurisé par Stripe 🔒
          </p>
        </div>

        {/* Grille des packages */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
          {packages.map((pkg) => (
            <div
              key={pkg.amount}
              className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-white via-pink-50 to-purple-100 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)] ring-4 ring-white/80 transition-all duration-300 ${
                pkg.popular ? 'transform scale-105 lg:scale-110 ring-8 ring-yellow-300' : 'hover:scale-105'
              }`}
            >
              {/* Badge */}
              {pkg.popular && (
                <div className='absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black text-sm rounded-full shadow-xl ring-4 ring-yellow-200/50 animate-bounce-slow'>
                  ⭐ {pkg.badge}
                </div>
              )}
              {!pkg.popular && (
                <div className='absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 font-black text-sm rounded-full shadow-lg'>
                  {pkg.badge}
                </div>
              )}

              <div className='text-center'>
                {/* Emoji du pack */}
                <div className='text-8xl mb-6 transform hover:scale-125 transition-transform duration-300'>
                  {pkg.emoji}
                </div>

                {/* Montant */}
                <div className='mb-6'>
                  <div className={`text-5xl font-black text-white bg-gradient-to-r ${pkg.color} rounded-2xl py-4 px-6 shadow-xl ring-4 ring-white/50`}>
                    {pkg.amount.toLocaleString('fr-FR')}
                  </div>
                  <p className='text-2xl font-bold text-purple-600 mt-3'>Koins</p>
                </div>

                {/* Prix */}
                <div className='mb-8'>
                  <div className='text-5xl font-black text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text mb-2'>
                    {pkg.price}€
                  </div>
                  <p className='text-sm text-gray-600 font-medium'>
                    Soit {(pkg.price / pkg.amount).toFixed(2)}€ par Koin
                  </p>
                </div>

                {/* Bouton d'achat */}
                <button
                  onClick={() => { void handlePurchase(pkg.amount) }}
                  disabled={isPurchasing}
                  className={`group relative overflow-hidden w-full bg-gradient-to-r ${pkg.color} hover:brightness-110 text-white font-black text-xl py-5 px-6 rounded-2xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl ring-4 ring-white/50 active:scale-105`}
                >
                  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover/btn:animate-shine' />
                  <span className='relative flex items-center justify-center gap-3'>
                    {isPurchasing
                      ? (
                        <>
                          <span className='animate-spin text-2xl'>⏳</span>
                          <span>Chargement...</span>
                        </>
                        )
                      : (
                        <>
                          <span className='text-2xl'>🛒</span>
                          <span>Acheter</span>
                        </>
                        )}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer informatif */}
        <div className='mt-12 p-8 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-3xl shadow-xl ring-4 ring-blue-200/50'>
          <div className='text-center'>
            <h3 className='text-2xl font-black text-blue-800 mb-4 flex items-center justify-center gap-3'>
              <span className='text-3xl'>ℹ️</span>
              Informations
              <span className='text-3xl'>ℹ️</span>
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-blue-700 font-bold'>
              <div className='flex flex-col items-center gap-2'>
                <span className='text-4xl'>🔒</span>
                <p>Paiement 100% sécurisé</p>
              </div>
              <div className='flex flex-col items-center gap-2'>
                <span className='text-4xl'>⚡</span>
                <p>Koins crédités instantanément</p>
              </div>
              <div className='flex flex-col items-center gap-2'>
                <span className='text-4xl'>💳</span>
                <p>Tous moyens de paiement acceptés</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
        }

        @keyframes twinkle-delayed {
          0%, 100% { opacity: 0.4; transform: scale(0.9) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(-180deg); }
        }

        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animate-twinkle-delayed { animation: twinkle-delayed 4s ease-in-out infinite; }
        .animate-shine { animation: shine 1.5s ease-in-out; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}
      </style>
    </div>
  )
}
