import type React from 'react'
import { AnimatedEmoji } from './ui/animated-emoji'
import { useCountUp } from '@/hooks/wallet/useCountUp'

interface WalletBalanceProps {
  balance: number
}

/**
 * Composant d'affichage du solde du wallet avec animation de compteur - Thème SLATE
 * Principe SRP: Responsabilité unique d'affichage du solde
 *
 * Couleurs adaptées au thème SLATE:
 * - Fond: white via slate-50 to slate-100
 * - Gradient texte: slate-700 via slate-800 to slate-900
 * - Animations: pulse-slow pour le fond
 */
export function WalletBalance ({ balance }: WalletBalanceProps): React.ReactElement {
  // Animation du compteur de 0 au montant actuel
  const animatedBalance = useCountUp(balance, 2000)

  const getKoinLabel = (): string => {
    if (animatedBalance === 0 || animatedBalance === 1) return 'Koin'
    return 'Koins'
  }

  return (
    <div className='relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-white via-slate-50 to-slate-100 p-12 mb-12 shadow-[0_30px_90px_rgba(0,0,0,0.25)] ring-8 ring-white/80'>
      <div className='absolute inset-0 bg-gradient-to-br from-slate-100/30 via-slate-200/30 to-slate-300/30 animate-pulse-slow' />

      <div className='relative z-10'>
        <div className='text-center'>
          <p className='text-xl font-bold text-slate-600 uppercase tracking-widest mb-4 flex items-center justify-center gap-2'>
            <span className='text-2xl'>💎</span>
            Ton Trésor Actuel
            <span className='text-2xl'>💎</span>
          </p>
          <div className='flex items-center justify-center gap-6'>
            <AnimatedEmoji emoji='🪙' size='lg' animation='animate-spin-slow' />
            <h2 className='text-9xl font-black text-transparent bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 bg-clip-text drop-shadow-2xl transition-all duration-300'>
              {animatedBalance.toLocaleString('fr-FR')}
            </h2>
            <AnimatedEmoji
              emoji='🪙'
              size='lg'
              animation='animate-spin-slow'
              className='[animation-delay:1s]'
            />
          </div>
          <p className='text-3xl font-black text-slate-700 mt-6'>
            {getKoinLabel()}
          </p>
        </div>
      </div>
    </div>
  )
}
