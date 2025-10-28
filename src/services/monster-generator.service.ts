/**
 * Monster Trait Generator Service
 * Implements procedural generation of unique monster characteristics
 * Following Clean Architecture: Domain Service
 * Following SOLID: Single Responsibility (only generates traits)
 */

import {
  MONSTER_COLORS,
  MONSTER_PATTERNS,
  MONSTER_SIZES,
  MONSTER_PERSONALITIES,
  MONSTER_FEATURES,
  type MonsterTraits,
  type TraitGenerationConfig,
  DEFAULT_TRAIT_CONFIG
} from '@/types/monsters/traits'

// Re-export types for convenience
export type { MonsterTraits, TraitGenerationConfig } from '@/types/monsters/traits'

/**
 * Seeded random number generator for reproducible results
 * Uses simple Linear Congruential Generator (LCG) algorithm
 */
class SeededRandom {
  private seed: number

  constructor (seed: string | number) {
    this.seed = typeof seed === 'string'
      ? this.hashString(seed)
      : seed
  }

  private hashString (str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  next (): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }

  nextInt (min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  choice<T> (array: readonly T[]): T {
    return array[this.nextInt(0, array.length - 1)]
  }

  sample<T> (array: readonly T[], count: number): T[] {
    const shuffled = [...array].sort(() => this.next() - 0.5)
    return shuffled.slice(0, count)
  }
}

/**
 * Generate random monster traits
 * @param config - Configuration for trait generation
 * @returns Complete set of monster traits
 */
export function generateMonsterTraits (
  config: TraitGenerationConfig = {}
): MonsterTraits {
  const finalConfig = { ...DEFAULT_TRAIT_CONFIG, ...config }
  const rng = new SeededRandom(finalConfig.seed)

  // Filter available options
  const availableColors = MONSTER_COLORS.filter(
    color => !finalConfig.excludeColors.includes(color)
  )
  const availablePersonalities = MONSTER_PERSONALITIES.filter(
    personality => !finalConfig.excludePersonalities.includes(personality)
  )

  // Generate random traits
  const color = rng.choice(availableColors)
  const pattern = rng.choice(MONSTER_PATTERNS)
  const size = rng.choice(MONSTER_SIZES)
  const personality = rng.choice(availablePersonalities)

  // Generate random number of features
  const featureCount = rng.nextInt(
    finalConfig.minFeatures,
    finalConfig.maxFeatures
  )
  const features = rng.sample(MONSTER_FEATURES, featureCount)

  return {
    color,
    pattern,
    size,
    personality,
    features,
    birthTimestamp: Date.now()
  }
}

/**
 * Generate traits with timestamp seed for unique monsters
 */
export function generateUniqueMonsterTraits (): MonsterTraits {
  return generateMonsterTraits({ seed: Date.now() + Math.random() })
}

/**
 * Generate traits from user ID seed for consistent first monster
 */
export function generateStarterMonsterTraits (userId: string): MonsterTraits {
  return generateMonsterTraits({
    seed: userId,
    minFeatures: 2,
    maxFeatures: 3
  })
}

/**
 * Serialize traits to JSON string for storage
 */
export function serializeTraits (traits: MonsterTraits): string {
  return JSON.stringify(traits)
}

/**
 * Deserialize traits from JSON string
 */
export function deserializeTraits (traitsJson: string): MonsterTraits {
  return JSON.parse(traitsJson) as MonsterTraits
}

/**
 * Get human-readable description of monster traits
 */
export function getTraitDescription (traits: MonsterTraits): string {
  const featureText = traits.features.length > 0
    ? ` with ${traits.features.map(f => f.replace(/_/g, ' ')).join(', ')}`
    : ''

  return `A ${traits.size} ${traits.pattern} ${traits.color} monster${featureText}. Personality: ${traits.personality}.`
}
