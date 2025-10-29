import type React from 'react'

/**
 * Composant de fond décoratif avec bulles et étoiles animées - Thème SLATE
 * Principe SRP: Responsabilité unique d'affichage du fond décoratif
 *
 * Couleurs adaptées au thème SLATE:
 * - Bulles: slate-300/20 à slate-400/20 (subtiles)
 * - Étoiles: 💎 (diamants) au lieu de pièces d'or
 */
export function DecorativeBackground (): React.ReactElement {
  return (
    <>
      {/* Bulles décoratives animées - Tons SLATE */}
      <div className='pointer-events-none fixed inset-0 overflow-hidden'>
        <div className='absolute -right-32 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-slate-300/20 to-slate-400/20 blur-3xl animate-float' />
        <div className='absolute -left-32 bottom-20 h-96 w-96 rounded-full bg-gradient-to-br from-slate-200/20 to-slate-300/20 blur-3xl animate-float-delayed' />
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-gradient-to-br from-slate-300/15 to-slate-400/15 blur-3xl animate-pulse-slow' />
      </div>

      {/* Étoiles décoratives - Thème professionnel SLATE */}
      <div className='pointer-events-none fixed top-20 right-40 text-6xl animate-twinkle'>⭐</div>
      <div className='pointer-events-none fixed top-40 left-20 text-5xl animate-twinkle-delayed'>💎</div>
      <div className='pointer-events-none fixed bottom-40 right-60 text-6xl animate-twinkle'>🪙</div>
    </>
  )
}
