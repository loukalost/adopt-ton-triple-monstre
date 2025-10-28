/**
 * Monster Traits Domain Types
 * Defines the characteristics that make each monster unique
 * Following Clean Architecture: Domain layer types
 */

// Physical traits
export const MONSTER_COLORS = [
  'crimson',
  'coral',
  'amber',
  'lime',
  'teal',
  'azure',
  'indigo',
  'violet',
  'rose',
  'slate'
] as const

export type MonsterColor = typeof MONSTER_COLORS[number]

export const MONSTER_PATTERNS = [
  'solid',
  'spotted',
  'striped',
  'gradient',
  'sparkly'
] as const

export type MonsterPattern = typeof MONSTER_PATTERNS[number]

export const MONSTER_SIZES = [
  'tiny',
  'small',
  'medium',
  'large',
  'huge'
] as const

export type MonsterSize = typeof MONSTER_SIZES[number]

// Personality traits
export const MONSTER_PERSONALITIES = [
  'playful',
  'shy',
  'energetic',
  'calm',
  'curious',
  'sleepy',
  'mischievous',
  'affectionate'
] as const

export type MonsterPersonality = typeof MONSTER_PERSONALITIES[number]

// Special features
export const MONSTER_FEATURES = [
  'fluffy_tail',
  'pointy_ears',
  'big_eyes',
  'small_horns',
  'tiny_wings',
  'whiskers',
  'antenna',
  'spiky_fur'
] as const

export type MonsterFeature = typeof MONSTER_FEATURES[number]

/**
 * Complete trait set for a monster
 */
export interface MonsterTraits {
  color: MonsterColor
  pattern: MonsterPattern
  size: MonsterSize
  personality: MonsterPersonality
  features: MonsterFeature[]
  birthTimestamp: number
}

/**
 * Trait configuration for generation
 */
export interface TraitGenerationConfig {
  minFeatures?: number
  maxFeatures?: number
  excludeColors?: MonsterColor[]
  excludePersonalities?: MonsterPersonality[]
  seed?: string | number
}

/**
 * Default configuration
 */
export const DEFAULT_TRAIT_CONFIG: Required<TraitGenerationConfig> = {
  minFeatures: 1,
  maxFeatures: 3,
  excludeColors: [],
  excludePersonalities: [],
  seed: Date.now()
}
