import { useEffect } from 'react'

/**
 * Hook personnalisé pour gérer les raccourcis clavier
 * Principe SRP: Responsabilité unique de gestion des raccourcis clavier
 *
 * @param {string} key - La touche à écouter (ex: 'Escape')
 * @param {() => void} callback - Fonction à exécuter quand la touche est pressée
 */
export function useKeyboardShortcut (key: string, callback: () => void): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === key) {
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [key, callback])
}
