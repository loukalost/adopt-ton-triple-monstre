/**
 * Monster Traits Display Component
 * Shows visual representation of monster characteristics
 * Following Clean Code: Single Responsibility - only displays traits
 */

import { type MonsterTraits } from '@/types/monsters/traits'

interface MonsterTraitsDisplayProps {
  traits: MonsterTraits
  variant?: 'compact' | 'detailed'
}

// Color mapping for visual representation
const COLOR_CLASSES: Record<string, string> = {
  crimson: 'bg-red-500',
  coral: 'bg-orange-400',
  amber: 'bg-amber-500',
  lime: 'bg-lime-500',
  teal: 'bg-teal-500',
  azure: 'bg-blue-400',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  rose: 'bg-rose-400',
  slate: 'bg-slate-500'
}

const PATTERN_ICONS: Record<string, string> = {
  solid: '⬤',
  spotted: '⚫',
  striped: '▥',
  gradient: '◐',
  sparkly: '✨'
}

const SIZE_TEXT: Record<string, string> = {
  tiny: 'Tiny',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  huge: 'Huge'
}

const PERSONALITY_EMOJI: Record<string, string> = {
  playful: '🎮',
  shy: '🙈',
  energetic: '⚡',
  calm: '😌',
  curious: '🔍',
  sleepy: '😴',
  mischievous: '😈',
  affectionate: '💕'
}

function TraitBadge ({ label, value, icon }: { label: string, value: string, icon?: string }): React.ReactNode {
  return (
    <div className='flex items-center gap-2 px-3 py-1.5 bg-white/50 rounded-full border border-moccaccino-200'>
      {icon !== undefined && <span className='text-sm'>{icon}</span>}
      <span className='text-xs font-medium text-moccaccino-700'>
        {label}: <span className='text-moccaccino-900'>{value}</span>
      </span>
    </div>
  )
}

function FeatureTag ({ feature }: { feature: string }): React.ReactNode {
  return (
    <span className='inline-block px-2 py-0.5 text-xs bg-fuchsia-blue-100 text-fuchsia-blue-700 rounded-full'>
      {feature.replace(/_/g, ' ')}
    </span>
  )
}

export default function MonsterTraitsDisplay ({
  traits,
  variant = 'detailed'
}: MonsterTraitsDisplayProps): React.ReactNode {
  if (variant === 'compact') {
    return (
      <div className='flex items-center gap-2 flex-wrap'>
        <div className={`w-4 h-4 rounded-full ${COLOR_CLASSES[traits.color]}`} />
        <span className='text-xs text-moccaccino-600'>
          {PATTERN_ICONS[traits.pattern]} {SIZE_TEXT[traits.size]}
        </span>
        <span className='text-sm'>{PERSONALITY_EMOJI[traits.personality]}</span>
      </div>
    )
  }

  return (
    <div className='space-y-3'>
      {/* Color and Pattern */}
      <div className='flex items-center gap-3'>
        <div className={`w-8 h-8 rounded-lg ${COLOR_CLASSES[traits.color]} border-2 border-white shadow-md`} />
        <div>
          <div className='text-sm font-semibold text-moccaccino-900 capitalize'>{traits.color}</div>
          <div className='text-xs text-moccaccino-600 flex items-center gap-1'>
            <span>{PATTERN_ICONS[traits.pattern]}</span>
            <span className='capitalize'>{traits.pattern}</span>
          </div>
        </div>
      </div>

      {/* Traits */}
      <div className='flex flex-wrap gap-2'>
        <TraitBadge label='Size' value={SIZE_TEXT[traits.size]} />
        <TraitBadge
          label='Personality'
          value={traits.personality}
          icon={PERSONALITY_EMOJI[traits.personality]}
        />
      </div>

      {/* Features */}
      {traits.features.length > 0 && (
        <div>
          <div className='text-xs font-medium text-moccaccino-700 mb-1.5'>Special Features:</div>
          <div className='flex flex-wrap gap-1.5'>
            {traits.features.map((feature, index) => (
              <FeatureTag key={index} feature={feature} />
            ))}
          </div>
        </div>
      )}

      {/* Birth date */}
      <div className='text-xs text-moccaccino-500 pt-2 border-t border-moccaccino-100'>
        Born: {new Date(traits.birthTimestamp).toLocaleDateString()}
      </div>
    </div>
  )
}
