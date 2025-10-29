import type { ShopBackground } from '@/types/monster'

/**
 * Catalogue des arrière-plans disponibles dans la boutique
 * Principe SRP: Responsabilité unique de définition du catalogue d'arrière-plans
 *
 * Prix de base: 100 Koins (common) * RARITY_MULTIPLIER
 */
export const SHOP_BACKGROUNDS: ShopBackground[] = [
  // === ARRIÈRE-PLANS NATURELS ===
  {
    id: 'bg_sunset',
    name: 'Coucher de Soleil',
    price: 350,
    description: 'Des couleurs chaudes et apaisantes',
    gradient: 'from-orange-400 to-pink-500',
    rarity: 'epic'
  },
  {
    id: 'bg_ocean',
    name: 'Océan Profond',
    price: 150,
    description: 'Les mystères des profondeurs marines',
    gradient: 'from-blue-400 to-cyan-500',
    rarity: 'rare'
  },
  {
    id: 'bg_forest',
    name: 'Forêt Enchantée',
    price: 150,
    description: 'Un environnement verdoyant et mystique',
    gradient: 'from-green-400 to-emerald-500',
    rarity: 'rare'
  },
  {
    id: 'bg_sky',
    name: 'Ciel Azuré',
    price: 100,
    description: 'Un ciel clair et ensoleillé',
    gradient: 'from-sky-300 to-blue-400',
    rarity: 'common'
  },

  // === ARRIÈRE-PLANS ABSTRAITS ===
  {
    id: 'bg_cosmic',
    name: 'Cosmos Infini',
    price: 750,
    description: 'L\'espace et ses mystères',
    gradient: 'from-purple-900 via-blue-900 to-black',
    rarity: 'legendary'
  },
  {
    id: 'bg_rainbow',
    name: 'Arc-en-ciel',
    price: 350,
    description: 'Toutes les couleurs du spectre',
    gradient: 'from-red-400 via-yellow-400 to-purple-500',
    rarity: 'epic'
  },
  {
    id: 'bg_aurora',
    name: 'Aurore Boréale',
    price: 750,
    description: 'Les lumières magiques du Nord',
    gradient: 'from-green-400 via-blue-500 to-purple-600',
    rarity: 'legendary'
  },
  {
    id: 'bg_lava',
    name: 'Lave Volcanique',
    price: 350,
    description: 'La puissance du feu intérieur',
    gradient: 'from-red-600 via-orange-600 to-yellow-500',
    rarity: 'epic'
  },

  // === ARRIÈRE-PLANS SAISONNIERS ===
  {
    id: 'bg_spring',
    name: 'Printemps Fleuri',
    price: 150,
    description: 'La renaissance de la nature',
    gradient: 'from-pink-300 to-green-300',
    rarity: 'rare'
  },
  {
    id: 'bg_autumn',
    name: 'Automne Doré',
    price: 150,
    description: 'Les couleurs chaudes de l\'automne',
    gradient: 'from-amber-400 to-red-500',
    rarity: 'rare'
  },
  {
    id: 'bg_winter',
    name: 'Hiver Glacial',
    price: 100,
    description: 'Un paysage enneigé et paisible',
    gradient: 'from-blue-200 to-slate-300',
    rarity: 'common'
  },

  // === ARRIÈRE-PLANS SPÉCIAUX ===
  {
    id: 'bg_neon',
    name: 'Néon Cyberpunk',
    price: 750,
    description: 'Style futuriste électrique',
    gradient: 'from-pink-500 via-purple-500 to-cyan-500',
    rarity: 'legendary'
  },
  {
    id: 'bg_candy',
    name: 'Bonbon Sucré',
    price: 150,
    description: 'Doux comme un bonbon',
    gradient: 'from-pink-300 via-purple-300 to-blue-300',
    rarity: 'rare'
  },
  {
    id: 'bg_desert',
    name: 'Désert Aride',
    price: 100,
    description: 'Les dunes infinies du désert',
    gradient: 'from-yellow-400 to-orange-500',
    rarity: 'common'
  },
  {
    id: 'bg_darkness',
    name: 'Ténèbres Éternelles',
    price: 350,
    description: 'L\'obscurité mystérieuse',
    gradient: 'from-gray-900 to-black',
    rarity: 'epic'
  }
]

/**
 * Nombre total d'arrière-plans par rareté
 */
export const BACKGROUNDS_COUNT = {
  common: SHOP_BACKGROUNDS.filter(bg => bg.rarity === 'common').length,
  rare: SHOP_BACKGROUNDS.filter(bg => bg.rarity === 'rare').length,
  epic: SHOP_BACKGROUNDS.filter(bg => bg.rarity === 'epic').length,
  legendary: SHOP_BACKGROUNDS.filter(bg => bg.rarity === 'legendary').length,
  total: SHOP_BACKGROUNDS.length
}
