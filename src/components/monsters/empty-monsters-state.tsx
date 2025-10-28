import { mergeClasses } from '@/lib/utils'

/**
 * Props pour le composant EmptyMonstersState
 */
interface EmptyMonstersStateProps {
  /** Classe CSS optionnelle */
  className?: string
}

/**
 * État vide affiché quand l'utilisateur n'a pas encore de monstres
 *
 * Responsabilité unique : afficher un message d'encouragement
 * quand la liste des monstres est vide.
 *
 * @param {EmptyMonstersStateProps} props - Props du composant
 * @returns {React.ReactNode} État vide stylisé
 *
 * @example
 * <EmptyMonstersState className="mt-10" />
 */
export function EmptyMonstersState ({ className }: EmptyMonstersStateProps): React.ReactNode {
  return (
    <div
      className={mergeClasses(
        'mt-10 w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center',
        className
      )}
    >
      <h2 className='text-xl font-semibold text-slate-900'>
        Aucune créature pour le moment
      </h2>
      <p className='mt-2 text-slate-600'>
        Créez votre première créature pour commencer l'aventure !
      </p>
      <div className='mt-6 text-6xl'>🥚</div>
    </div>
  )
}
