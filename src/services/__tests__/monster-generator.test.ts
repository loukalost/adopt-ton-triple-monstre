/**
 * Monster Generator Tests
 * Simple test file to verify the procedural generation system
 * Run with: node --loader tsx src/services/__tests__/monster-generator.test.ts
 */

import {
  generateMonsterTraits,
  generateUniqueMonsterTraits,
  generateStarterMonsterTraits,
  serializeTraits,
  deserializeTraits,
  getTraitDescription
} from '../monster-generator.service'

console.log('🧪 Testing Monster Generator Service\n')

// Test 1: Generate with seed for reproducibility
console.log('Test 1: Seeded generation (should be reproducible)')
const seed = 'test-seed-123'
const monster1 = generateMonsterTraits({ seed })
const monster2 = generateMonsterTraits({ seed })
console.log('Monster 1:', monster1)
console.log('Monster 2:', monster2)
console.log('✓ Same seed produces same traits:', JSON.stringify(monster1) === JSON.stringify(monster2))
console.log()

// Test 2: Generate unique monsters
console.log('Test 2: Unique generation (should be different)')
const unique1 = generateUniqueMonsterTraits()
const unique2 = generateUniqueMonsterTraits()
console.log('Unique 1:', unique1)
console.log('Unique 2:', unique2)
console.log('✓ Different monsters:', JSON.stringify(unique1) !== JSON.stringify(unique2))
console.log()

// Test 3: Starter monster generation
console.log('Test 3: Starter monster (consistent for same user)')
const userId = 'user-123'
const starter1 = generateStarterMonsterTraits(userId)
const starter2 = generateStarterMonsterTraits(userId)
console.log('Starter 1:', starter1)
console.log('Starter 2:', starter2)
console.log('✓ Same user gets same starter:', JSON.stringify(starter1) === JSON.stringify(starter2))
console.log()

// Test 4: Serialization
console.log('Test 4: Serialization and deserialization')
const original = generateUniqueMonsterTraits()
const serialized = serializeTraits(original)
const deserialized = deserializeTraits(serialized)
console.log('Original:', original)
console.log('Serialized:', serialized)
console.log('Deserialized:', deserialized)
console.log('✓ Round-trip successful:', JSON.stringify(original) === JSON.stringify(deserialized))
console.log()

// Test 5: Description generation
console.log('Test 5: Human-readable description')
const testMonster = generateMonsterTraits({ seed: 'description-test' })
const description = getTraitDescription(testMonster)
console.log('Monster:', testMonster)
console.log('Description:', description)
console.log()

// Test 6: Configuration options
console.log('Test 6: Custom configuration')
const customMonster = generateMonsterTraits({
  seed: 'custom-test',
  minFeatures: 3,
  maxFeatures: 3,
  excludeColors: ['crimson', 'coral'],
  excludePersonalities: ['shy', 'sleepy']
})
console.log('Custom monster:', customMonster)
console.log('✓ Has exactly 3 features:', customMonster.features.length === 3)
console.log('✓ Not crimson or coral:', !['crimson', 'coral'].includes(customMonster.color))
console.log('✓ Not shy or sleepy:', !['shy', 'sleepy'].includes(customMonster.personality))
console.log()

console.log('✅ All tests completed!')
