import Link from 'next/link'
import { PixelMonster } from '@/components/monsters/pixel-monster'
import { MonsterStateBadge, isMonsterState } from './monster-state-badge'
import type { MonsterState } from '@/types/monster'
import { parseMonsterTraits, formatAdoptionDate } from '@/lib/utils'

/**
 * Props pour le composant MonsterCard
 */
interface MonsterCardProps {
  /** Identifiant unique du monstre */
  id: string
  /** Nom du monstre */
  name: string
  /** Traits visuels du monstre (JSON stringifié) */
  traits: string
  /** État/humeur actuel du monstre */
  state: MonsterState | string | null | undefined
  /** Niveau du monstre */
  level: number | null | undefined
  /** Date de création du monstre */
  createdAt: string | undefined
  /** Date de dernière mise à jour du monstre */
  updatedAt: string | undefined
}

/**
 * Carte d'affichage d'un monstre individuel
 *
 * Responsabilité unique : afficher les informations visuelles
 * et textuelles d'un monstre dans un format carte cliquable.
 *
 * Applique SRP en déléguant :
 * - Le rendu du monstre à PixelMonster
 * - L'affichage de l'état à MonsterStateBadge
 * - Le parsing des traits à parseMonsterTraits
 * - Le formatage de la date à formatAdoptionDate
 *
 * @param {MonsterCardProps} props - Props du composant
 * @returns {React.ReactNode} Carte de monstre interactive
 *
 * @example
 * <MonsterCard
 *   id="123"
 *   name="Pikachu"
 *   traits='{"bodyColor": "#FFB5E8"}'
 *   state="happy"
 *   level={5}
 *   createdAt="2025-10-27T10:00:00Z"
 *   updatedAt="2025-10-27T12:00:00Z"
 * />
 */
export function MonsterCard ({
  id,
  name,
  traits: rawTraits,
  state,
  level,
  createdAt,
  updatedAt
}: MonsterCardProps): React.ReactNode {
  // Parsing des traits et normalisation des données
  const traits = parseMonsterTraits(rawTraits)
  const adoptionDate = formatAdoptionDate(String(createdAt) ?? String(updatedAt))
  const levelLabel = level ?? 1

  return (
    <Link href={`/creature/${id}`}>
      <article
        className='group relative flex flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:shadow-lg hover:ring-slate-300 hover:-translate-y-1'
      >
        <div className='relative flex flex-col gap-5'>
          {/* Zone de rendu du monstre */}
          <div className='relative flex items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200'>
            {traits !== null && (
              <PixelMonster
                traits={traits}
                state={isMonsterState(state) ? state : 'happy'}
                level={levelLabel}
              />
            )}
            <MonsterStateBadge state={state} />
          </div>

          {/* Informations textuelles */}
          <div className='flex flex-1 flex-col gap-3'>
            <div className='flex items-start justify-between gap-3'>
              <div className='space-y-1'>
                <h3 className='text-lg font-semibold text-slate-900 sm:text-xl'>{name}</h3>
                {adoptionDate !== null && (
                  <p className='text-xs text-slate-500'>Arrivé le {adoptionDate}</p>
                )}
              </div>

              <span className='inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-700 ring-1 ring-slate-200'>
                <span aria-hidden='true'>⭐</span>
                LVL {levelLabel}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
