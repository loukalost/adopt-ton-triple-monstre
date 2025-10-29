/**
 * Monster Generator Service
 * Simple and proven system from RiusmaX/tamagotcho
 * Following Clean Architecture: Domain Service
 * Following SOLID: Single Responsibility (generates visual traits only)
 */

import type { MonsterTraits, MonsterStyle, EyeStyle, AntennaStyle, AccessoryStyle } from '@/types/monster'

// Couleurs pastels pour les monstres
const pastelColors = [
  ['#FFB5E8', '#FF9CEE'], // Rose pastel
  ['#B5E8FF', '#9CD8FF'], // Bleu pastel
  ['#E8FFB5', '#D8FF9C'], // Vert pastel
  ['#FFE8B5', '#FFD89C'], // Orange pastel
  ['#E8B5FF', '#D89CFF'], // Violet pastel
  ['#FFB5C5', '#FF9CB5'], // Rose vif pastel
  ['#B5FFE8', '#9CFFD8'], // Turquoise pastel
  ['#FFC5B5', '#FFB59C'] // Pêche pastel
]

// Couleurs vives pour les antennes
const antennaColors = ['#FFE66D', '#FF6B9D', '#6BDBFF', '#B4FF6B', '#FF9CEE', '#FFB347']

// Couleurs sombres pour les yeux
const eyeColors = ['#2C2C2C', '#4A4A4A', '#1A1A1A', '#3D3D3D']

// Options de styles
const bodyStyles: MonsterStyle[] = ['round', 'square', 'tall', 'wide']
const eyeStyles: EyeStyle[] = ['big', 'small', 'star', 'sleepy']
const antennaStyles: AntennaStyle[] = ['single', 'double', 'curly', 'none']
const accessories: AccessoryStyle[] = ['horns', 'ears', 'tail', 'none']

/**
 * Génère des traits aléatoires pour un monstre
 * Fonction pure sans effets de bord (SOLID: SRP)
 *
 * @returns {MonsterTraits} Traits visuels complets du monstre
 *
 * @example
 * const traits = generateRandomTraits()
 * // {
 * //   bodyColor: '#FFB5E8',
 * //   accentColor: '#FF9CEE',
 * //   eyeColor: '#2C2C2C',
 * //   antennaColor: '#FFE66D',
 * //   bobbleColor: '#FFE66D',
 * //   cheekColor: '#FFD6F1',
 * //   bodyStyle: 'round',
 * //   eyeStyle: 'big',
 * //   antennaStyle: 'double',
 * //   accessory: 'horns'
 * // }
 */
export function generateRandomTraits (): MonsterTraits {
  // Sélection aléatoire d'une palette de couleurs
  const randomPalette = pastelColors[Math.floor(Math.random() * pastelColors.length)]
  const randomAntenna = antennaColors[Math.floor(Math.random() * antennaColors.length)]
  const randomEye = eyeColors[Math.floor(Math.random() * eyeColors.length)]

  return {
    bodyColor: randomPalette[0],
    accentColor: randomPalette[1],
    eyeColor: randomEye,
    antennaColor: randomAntenna,
    bobbleColor: randomAntenna,
    cheekColor: adjustColorOpacity(randomPalette[0], 0.7),
    bodyStyle: bodyStyles[Math.floor(Math.random() * bodyStyles.length)],
    eyeStyle: eyeStyles[Math.floor(Math.random() * eyeStyles.length)],
    antennaStyle: antennaStyles[Math.floor(Math.random() * antennaStyles.length)],
    accessory: accessories[Math.floor(Math.random() * accessories.length)]
  }
}

/**
 * Ajuste l'opacité d'une couleur hexadécimale
 * Crée une version plus claire de la couleur pour les variations
 *
 * @param {string} hex - Couleur hexadécimale (#RRGGBB)
 * @param {number} opacity - Opacité entre 0 et 1
 * @returns {string} Nouvelle couleur hexadécimale ajustée
 *
 * @example
 * adjustColorOpacity('#FFB5E8', 0.7) // '#FFD6F1' (plus clair)
 */
function adjustColorOpacity (hex: string, opacity: number): string {
  // Extraction des composantes RGB
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  // Ajustement de l'opacité (vers le blanc)
  const adjustedR = Math.round(r + (255 - r) * (1 - opacity))
  const adjustedG = Math.round(g + (255 - g) * (1 - opacity))
  const adjustedB = Math.round(b + (255 - b) * (1 - opacity))

  // Conversion en hexadécimal
  return `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG.toString(16).padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`
}
