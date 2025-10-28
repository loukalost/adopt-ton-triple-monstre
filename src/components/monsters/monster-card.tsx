/**
 * Monster Card Component
 * Displays a monster with its traits in a card layout
 * Following SOLID: Single Responsibility - displays one monster
 */

import { type DBMonster } from '@/db/models/monster.model'
import { deserializeTraits } from '@/services/monster-generator.service'
import MonsterTraitsDisplay from './monster-traits-display'
import PixelBlackCat, { type PixelBlackCatState } from './black-cat'
import { type MonsterState } from '@/types/monsters/domain'

interface MonsterCardProps {
  monster: DBMonster
}

const STATE_TO_PIXEL_STATE: Record<MonsterState, PixelBlackCatState> = {
  happy: 'happy',
  sad: 'idle',
  angry: 'idle',
  hungry: 'idle',
  sleepy: 'sleep'
}

export default function MonsterCard ({ monster }: MonsterCardProps): React.ReactNode {
  const traits = deserializeTraits(monster.traits)
  const pixelState = STATE_TO_PIXEL_STATE[monster.state]

  return (
    <div className='bg-white rounded-2xl shadow-lg border border-moccaccino-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]'>
      {/* Header with name and level */}
      <div className='bg-gradient-to-r from-moccaccino-500 to-fuchsia-blue-500 px-6 py-4'>
        <h3 className='text-xl font-bold text-white'>{monster.name}</h3>
        <div className='flex items-center gap-2 mt-1'>
          <span className='text-xs font-semibold text-white/90'>Niveau {monster.level}</span>
          <span className='text-xs text-white/80'>•</span>
          <span className='text-xs text-white/80 capitalize'>{monster.state}</span>
        </div>
      </div>

      {/* Monster preview and traits */}
      <div className='p-6 space-y-4'>
        {/* Pixel art preview */}
        <div className='flex justify-center'>
          <PixelBlackCat state={pixelState} layout='compact' showControls={false} />
        </div>

        {/* Traits display */}
        <div className='border-t border-moccaccino-100 pt-4'>
          <h4 className='text-sm font-semibold text-moccaccino-900 mb-3'>Caractéristiques</h4>
          <MonsterTraitsDisplay traits={traits} variant='detailed' />
        </div>

        {/* Action buttons */}
        <div className='flex gap-2 pt-4 border-t border-moccaccino-100'>
          <button className='flex-1 px-4 py-2 bg-lochinvar-100 text-lochinvar-700 rounded-lg text-sm font-medium hover:bg-lochinvar-200 transition-colors'>
            Voir détails
          </button>
          <button className='flex-1 px-4 py-2 bg-moccaccino-100 text-moccaccino-700 rounded-lg text-sm font-medium hover:bg-moccaccino-200 transition-colors'>
            Interagir
          </button>
        </div>
      </div>
    </div>
  )
}
