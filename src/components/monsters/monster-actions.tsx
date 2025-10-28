'use client'

import { doActionOnMonster } from '@/actions/monsters.actions'
import { useMonsterAction, type MonsterAction } from '@/hooks/monsters'

/**
 * Props pour le composant MonsterActions
 */
interface MonsterActionsProps {
  /** Callback appelé lorsqu'une action est déclenchée */
  onAction: (action: MonsterAction) => void
  /** ID du monstre */
  monsterId: string
}

/**
 * Définition d'une action disponible sur un monstre
 */
interface ActionDefinition {
  /** Clé de l'action */
  action: MonsterAction
  /** Emoji représentant l'action */
  emoji: string
  /** Label textuel de l'action */
  label: string
}

/**
 * Liste des actions disponibles pour interagir avec un monstre
 */
const AVAILABLE_ACTIONS: ActionDefinition[] = [
  { action: 'feed', emoji: '🍎', label: 'Nourrir' },
  { action: 'comfort', emoji: '💙', label: 'Consoler' },
  { action: 'hug', emoji: '🤗', label: 'Câliner' },
  { action: 'wake', emoji: '⏰', label: 'Réveiller' }
]

/**
 * Props pour le composant ActionButton
 */
interface ActionButtonProps {
  /** Clé de l'action */
  action: MonsterAction
  /** Emoji de l'action */
  emoji: string
  /** Label de l'action */
  label: string
  /** Si l'action est actuellement active */
  isActive: boolean
  /** Si le bouton est désactivé */
  isDisabled: boolean
  /** Callback au clic */
  onClick: () => void
}

/**
 * Bouton d'action individuel pour interagir avec un monstre
 *
 * Responsabilité unique : afficher un bouton d'action avec
 * ses états visuels (normal, actif, désactivé).
 *
 * @param {ActionButtonProps} props - Props du composant
 * @returns {React.ReactNode} Bouton stylisé
 *
 * @example
 * <ActionButton
 *   action="feed"
 *   emoji="🍎"
 *   label="Nourrir"
 *   isActive={false}
 *   isDisabled={false}
 *   onClick={handleFeed}
 * />
 */
function ActionButton ({
  emoji,
  label,
  isActive,
  isDisabled,
  onClick
}: ActionButtonProps): React.ReactNode {
  const baseClass = 'px-4 py-3 text-sm rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200'
  const activeClass = isActive
    ? 'bg-slate-200 text-slate-500 ring-2 ring-slate-400 ring-offset-2 scale-95'
    : isDisabled
      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
      : 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer active:scale-95 hover:shadow-md border border-transparent'

  return (
    <button
      className={`${baseClass} ${activeClass}`}
      onClick={onClick}
      disabled={isDisabled}
      type='button'
    >
      <span className='text-xl'>{emoji}</span>
      <span>{label}</span>
    </button>
  )
}

/**
 * Composant de gestion des actions sur un monstre
 *
 * Responsabilité unique : orchestrer l'affichage des boutons d'action
 * et gérer l'état de l'action en cours.
 *
 * Applique SRP en déléguant :
 * - La gestion de l'état d'action au hook useMonsterAction
 * - L'affichage de chaque bouton à ActionButton
 *
 * @param {MonsterActionsProps} props - Props du composant
 * @returns {React.ReactNode} Section d'actions
 *
 * @example
 * <MonsterActions onAction={(action) => console.log(action)} />
 */
export function MonsterActions ({ onAction, monsterId }: MonsterActionsProps): React.ReactNode {
  const { activeAction, triggerAction } = useMonsterAction()

  /**
   * Gère le déclenchement d'une action
   * @param {MonsterAction} action - Action à déclencher
   */
  const handleAction = (action: MonsterAction): void => {
    triggerAction(action, onAction)
    void doActionOnMonster(monsterId, action)
  }

  return (
    <div className='mt-6'>
      <h3 className='text-lg font-bold text-center text-slate-900 mb-4'>
        Actions
      </h3>

      <div className='grid grid-cols-2 gap-3'>
        {AVAILABLE_ACTIONS.map(({ action, emoji, label }) => (
          <ActionButton
            key={action}
            action={action}
            emoji={emoji}
            label={label}
            isActive={activeAction === action}
            isDisabled={activeAction !== null}
            onClick={() => { handleAction(action) }}
          />
        ))}
      </div>

      {/* Indicateur d'action en cours */}
      {activeAction !== null && (
        <div className='mt-4 text-center'>
          <div className='inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200'>
            <div className='w-2 h-2 bg-slate-900 rounded-full animate-ping' />
            <span className='text-sm font-semibold text-slate-700'>
              Action en cours...
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
