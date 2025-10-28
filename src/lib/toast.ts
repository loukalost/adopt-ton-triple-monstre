/**
 * Toast Notification Helpers
 * Centralized functions for showing notifications
 * Following SOLID: Single Responsibility - only toast notifications
 */

import { toast, type ToastOptions } from 'react-toastify'

/**
 * Common toast options for consistency
 */
const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
}

/**
 * Success notification
 */
export function showSuccess (message: string, options?: ToastOptions): void {
  toast.success(message, { ...defaultOptions, ...options })
}

/**
 * Error notification
 */
export function showError (message: string, options?: ToastOptions): void {
  toast.error(message, { ...defaultOptions, ...options })
}

/**
 * Info notification
 */
export function showInfo (message: string, options?: ToastOptions): void {
  toast.info(message, { ...defaultOptions, ...options })
}

/**
 * Warning notification
 */
export function showWarning (message: string, options?: ToastOptions): void {
  toast.warning(message, { ...defaultOptions, ...options })
}

/**
 * Monster action notifications (themed for Tamagotchi actions)
 */
export const monsterToasts = {
  feed: () => showSuccess('🍖 Monstre nourri avec succès !'),
  comfort: () => showSuccess('🛏️ Monstre réconforté !'),
  cuddle: () => showSuccess('💕 Câlin donné au monstre !'),
  wake: () => showSuccess('☀️ Monstre réveillé !'),

  created: (name: string) => showSuccess(`🎉 ${name} a été créé avec succès !`),
  deleted: (name: string) => showInfo(`👋 ${name} a été supprimé`),
  updated: (name: string) => showSuccess(`✨ ${name} a été mis à jour !`),

  levelUp: (name: string, level: number) =>
    showSuccess(`🎊 ${name} est maintenant niveau ${level} !`, { autoClose: 5000 }),

  stateChanged: (state: string) =>
    showInfo(`État changé: ${state}`, { autoClose: 2000 })
}

/**
 * Authentication notifications
 */
export const authToasts = {
  signInSuccess: () => showSuccess('✅ Connexion réussie !'),
  signUpSuccess: () => showSuccess('🎉 Compte créé avec succès !'),
  signOutSuccess: () => showInfo('👋 Déconnexion réussie'),

  signInError: () => showError('❌ Erreur de connexion'),
  signUpError: (message: string) => showError(`❌ ${message}`),

  invalidCredentials: () => showError('🔐 Identifiants invalides'),
  emailAlreadyExists: () => showError('📧 Cet email existe déjà'),

  sessionExpired: () => showWarning('⏰ Session expirée, reconnectez-vous')
}

/**
 * Form validation notifications
 */
export const validationToasts = {
  requiredField: (fieldName: string) =>
    showWarning(`⚠️ ${fieldName} est requis`),

  invalidFormat: (fieldName: string) =>
    showWarning(`⚠️ Format invalide pour ${fieldName}`),

  formSubmitted: () => showSuccess('✅ Formulaire soumis !'),

  formError: () => showError('❌ Erreur lors de la soumission')
}

/**
 * Generic loading toast with promise
 */
export async function showLoadingToast<T> (
  promise: Promise<T>,
  messages: {
    pending: string
    success: string
    error: string
  }
): Promise<T> {
  return await toast.promise<T>(
    promise,
    {
      pending: messages.pending,
      success: messages.success,
      error: messages.error
    },
    defaultOptions as ToastOptions<T>
  )
}

/**
 * Dismiss all toasts
 */
export function dismissAllToasts (): void {
  toast.dismiss()
}

/**
 * Custom toast with emoji and color
 */
export function showCustomToast (
  emoji: string,
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'info',
  options?: ToastOptions
): void {
  const fullMessage = `${emoji} ${message}`

  switch (type) {
    case 'success':
      showSuccess(fullMessage, options)
      break
    case 'error':
      showError(fullMessage, options)
      break
    case 'warning':
      showWarning(fullMessage, options)
      break
    default:
      showInfo(fullMessage, options)
  }
}
