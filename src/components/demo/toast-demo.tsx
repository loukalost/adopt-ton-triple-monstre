/**
 * Toast Demo Component
 * Demonstrates all toast notification types
 * Useful for testing and documentation
 */

'use client'

import Button from '@/components/buttons/button'
import {
  showSuccess,
  showError,
  showInfo,
  showWarning,
  monsterToasts,
  authToasts,
  validationToasts,
  showLoadingToast,
  showCustomToast,
  dismissAllToasts
} from '@/lib/toast'

export default function ToastDemo (): React.ReactNode {
  // Simulate async operation
  const simulateAsyncOperation = async (): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    return 'Opération terminée'
  }

  return (
    <div className='p-8 space-y-8 max-w-4xl mx-auto'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-moccaccino-700 mb-2'>
          🎨 Démo des Notifications Toast
        </h1>
        <p className='text-moccaccino-600'>
          Testez tous les types de notifications de l'application
        </p>
      </div>

      {/* Basic Toasts */}
      <section className='space-y-3'>
        <h2 className='text-xl font-semibold text-moccaccino-800'>Notifications Basiques</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
          <Button
            variant='primary'
            size='sm'
            onClick={() => { showSuccess('Opération réussie !') }}
          >
            ✅ Success
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => { showError('Une erreur est survenue') }}
          >
            ❌ Error
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => { showInfo('Information importante') }}
          >
            ℹ️ Info
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => { showWarning('Attention requise') }}
          >
            ⚠️ Warning
          </Button>
        </div>
      </section>

      {/* Monster Toasts */}
      <section className='space-y-3'>
        <h2 className='text-xl font-semibold text-moccaccino-800'>Actions Monstres</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
          <Button
            variant='primary'
            size='sm'
            onClick={() => { monsterToasts.feed() }}
          >
            🍖 Nourrir
          </Button>
          <Button
            variant='primary'
            size='sm'
            onClick={() => { monsterToasts.comfort() }}
          >
            🛏️ Réconforter
          </Button>
          <Button
            variant='primary'
            size='sm'
            onClick={() => { monsterToasts.cuddle() }}
          >
            💕 Câliner
          </Button>
          <Button
            variant='primary'
            size='sm'
            onClick={() => { monsterToasts.wake() }}
          >
            ☀️ Réveiller
          </Button>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => { monsterToasts.created('Fluffy') }}
          >
            🎉 Créé
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => { monsterToasts.updated('Fluffy') }}
          >
            ✨ Mis à jour
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => { monsterToasts.levelUp('Fluffy', 5) }}
          >
            🎊 Level Up
          </Button>
        </div>
      </section>

      {/* Auth Toasts */}
      <section className='space-y-3'>
        <h2 className='text-xl font-semibold text-moccaccino-800'>Authentification</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
          <Button
            variant='primary'
            size='sm'
            onClick={() => { authToasts.signInSuccess() }}
          >
            ✅ Connexion
          </Button>
          <Button
            variant='primary'
            size='sm'
            onClick={() => { authToasts.signUpSuccess() }}
          >
            🎉 Inscription
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => { authToasts.signOutSuccess() }}
          >
            👋 Déconnexion
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => { authToasts.signInError() }}
          >
            ❌ Erreur connexion
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => { authToasts.invalidCredentials() }}
          >
            🔐 Identifiants
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => { authToasts.sessionExpired() }}
          >
            ⏰ Session expirée
          </Button>
        </div>
      </section>

      {/* Validation Toasts */}
      <section className='space-y-3'>
        <h2 className='text-xl font-semibold text-moccaccino-800'>Validation Formulaire</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => { validationToasts.requiredField('Nom') }}
          >
            ⚠️ Champ requis
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => { validationToasts.invalidFormat('Email') }}
          >
            ⚠️ Format invalide
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => { validationToasts.formSubmitted() }}
          >
            ✅ Soumis
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => { validationToasts.formError() }}
          >
            ❌ Erreur
          </Button>
        </div>
      </section>

      {/* Loading Toast */}
      <section className='space-y-3'>
        <h2 className='text-xl font-semibold text-moccaccino-800'>Toast avec Promesse</h2>
        <Button
          variant='primary'
          onClick={() => {
            void showLoadingToast(
              simulateAsyncOperation(),
              {
                pending: '🔄 Chargement en cours...',
                success: '✅ Opération terminée !',
                error: '❌ Échec de l\'opération'
              }
            )
          }}
        >
          🔄 Tester l'opération async (2s)
        </Button>
      </section>

      {/* Custom Toasts */}
      <section className='space-y-3'>
        <h2 className='text-xl font-semibold text-moccaccino-800'>Toasts Personnalisés</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => { showCustomToast('🎮', 'Nouveau niveau !', 'success') }}
          >
            🎮 Gaming
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => { showCustomToast('🏆', 'Succès débloqué !', 'info') }}
          >
            🏆 Succès
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => { showCustomToast('⚔️', 'Combat !', 'warning') }}
          >
            ⚔️ Combat
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => { showCustomToast('💎', 'Item rare trouvé !', 'success', { autoClose: 5000 }) }}
          >
            💎 Rare (5s)
          </Button>
        </div>
      </section>

      {/* Control */}
      <section className='space-y-3'>
        <h2 className='text-xl font-semibold text-moccaccino-800'>Contrôle</h2>
        <Button
          variant='ghost'
          onClick={dismissAllToasts}
        >
          🗑️ Fermer tous les toasts
        </Button>
      </section>

      {/* Info */}
      <div className='mt-8 p-4 bg-fuchsia-blue-50 border border-fuchsia-blue-200 rounded-lg'>
        <h3 className='font-semibold text-fuchsia-blue-800 mb-2'>💡 Notes</h3>
        <ul className='text-sm text-fuchsia-blue-700 space-y-1 list-disc list-inside'>
          <li>Les toasts s'affichent en haut à droite par défaut</li>
          <li>Durée d'affichage : 3 secondes (personnalisable)</li>
          <li>Pause automatique au survol de la souris</li>
          <li>Les toasts sont déplaçables par glisser-déposer</li>
          <li>Styles alignés avec la palette de couleurs du projet</li>
        </ul>
      </div>
    </div>
  )
}
