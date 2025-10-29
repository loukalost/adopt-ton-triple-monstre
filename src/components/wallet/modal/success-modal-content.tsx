import type React from 'react'
import { GradientButton } from '../ui/gradient-button'

interface SuccessModalContentProps {
  onClose: () => void
}

/**
 * Composant contenu du modal de succès - Thème SLATE
 * Principe SRP: Responsabilité unique d'affichage du contenu de succès
 *
 * Couleurs adaptées au thème SLATE:
 * - Bordure: slate-700 to slate-900 (professionnel)
 * - Fond: white to slate-50 (léger)
 * - Bouton: emerald (vert = succès universel)
 */
export function SuccessModalContent ({ onClose }: SuccessModalContentProps): React.ReactElement {
  return (
    <div className='relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-1 shadow-[0_30px_90px_rgba(0,0,0,0.4)]'>
      {/* Animations de fond */}
      <div className='absolute inset-0 animate-pulse-slow'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-500/30 via-slate-600/30 to-slate-700/30' />
      </div>

      {/* Contenu */}
      <div className='relative bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-[2.8rem] p-12'>
        {/* Étoiles décoratives */}
        <div className='absolute top-8 left-8 text-6xl animate-twinkle-star'>⭐</div>
        <div className='absolute top-12 right-12 text-5xl animate-twinkle-star [animation-delay:0.3s]'>✨</div>
        <div className='absolute bottom-12 left-16 text-5xl animate-twinkle-star [animation-delay:0.6s]'>💫</div>

        {/* Emoji principal animé */}
        <div className='text-center mb-8'>
          <div className='inline-block animate-success-bounce'>
            <div className='text-[10rem] leading-none filter drop-shadow-2xl'>
              🎉
            </div>
          </div>
        </div>

        {/* Titre - Gradient SLATE */}
        <h2 className='text-6xl font-black text-center mb-4 text-transparent bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 bg-clip-text drop-shadow-lg'>
          Succès !
        </h2>

        {/* Message */}
        <p className='text-3xl font-bold text-center text-slate-700 mb-8'>
          Tes Koins ont été ajoutés ! 🪙✨
        </p>

        {/* Détails fun */}
        <div className='bg-gradient-to-r from-slate-50 to-slate-100 rounded-3xl p-6 mb-8 border-4 border-slate-300 shadow-xl'>
          <div className='flex items-center justify-center gap-4 text-2xl font-bold text-slate-800'>
            <span className='text-4xl animate-spin-slow'>💰</span>
            <span>Ton trésor s'agrandit !</span>
            <span className='text-4xl animate-spin-slow [animation-delay:1s]'>🎊</span>
          </div>
        </div>

        {/* Bouton de fermeture - Emerald (succès) */}
        <GradientButton
          onClick={onClose}
          gradient='from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
          className='text-2xl py-6 px-8 rounded-3xl'
        >
          <span className='text-3xl'>🎮</span>
          <span>Continuer l'Aventure</span>
          <span className='text-3xl'>🚀</span>
        </GradientButton>
      </div>
    </div>
  )
}
