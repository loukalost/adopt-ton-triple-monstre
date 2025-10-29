import type { ShopAccessory } from '@/types/monster'

/**
 * Catalogue des accessoires disponibles dans la boutique
 * Principe SRP: Responsabilité unique de définition du catalogue d'accessoires
 *
 * Prix de base: 50 Koins (common) * RARITY_MULTIPLIER
 */
export const SHOP_ACCESSORIES: ShopAccessory[] = [
  // === CHAPEAUX (7 items) ===
  {
    id: 'hat_cap',
    name: 'Casquette',
    category: 'hat',
    rarity: 'common',
    price: 50,
    description: 'Une casquette classique pour un style décontracté',
    emoji: '🧢'
  },
  {
    id: 'hat_tophat',
    name: 'Haut-de-forme',
    category: 'hat',
    rarity: 'rare',
    price: 150,
    description: 'L\'élégance incarnée pour les grandes occasions',
    emoji: '🎩'
  },
  {
    id: 'hat_cowboy',
    name: 'Chapeau Cowboy',
    category: 'hat',
    rarity: 'rare',
    price: 150,
    description: 'Yeehaw! Pour les monstres aventuriers',
    emoji: '🤠'
  },
  {
    id: 'hat_party',
    name: 'Chapeau de Fête',
    category: 'hat',
    rarity: 'common',
    price: 50,
    description: 'Parfait pour célébrer les victoires',
    emoji: '🎉'
  },
  {
    id: 'hat_wizard',
    name: 'Chapeau de Sorcier',
    category: 'hat',
    rarity: 'epic',
    price: 350,
    description: 'Confère des pouvoirs magiques mystérieux',
    emoji: '🧙'
  },
  {
    id: 'hat_crown',
    name: 'Couronne Royale',
    category: 'hat',
    rarity: 'legendary',
    price: 750,
    description: 'Seuls les monstres les plus nobles peuvent la porter',
    emoji: '👑'
  },
  {
    id: 'hat_beret',
    name: 'Béret Artistique',
    category: 'hat',
    rarity: 'rare',
    price: 150,
    description: 'Pour les monstres créatifs et bohèmes',
    emoji: '🎨'
  },

  // === LUNETTES (6 items) ===
  {
    id: 'glasses_regular',
    name: 'Lunettes Classiques',
    category: 'glasses',
    rarity: 'common',
    price: 50,
    description: 'Des lunettes simples mais efficaces',
    emoji: '👓'
  },
  {
    id: 'glasses_sun',
    name: 'Lunettes de Soleil',
    category: 'glasses',
    rarity: 'rare',
    price: 150,
    description: 'Style et protection contre les UV',
    emoji: '🕶️'
  },
  {
    id: 'glasses_monocle',
    name: 'Monocle Sophistiqué',
    category: 'glasses',
    rarity: 'epic',
    price: 350,
    description: 'Pour les monstres distingués',
    emoji: '🧐'
  },
  {
    id: 'glasses_3d',
    name: 'Lunettes 3D',
    category: 'glasses',
    rarity: 'common',
    price: 50,
    description: 'Pour voir le monde en relief',
    emoji: '🎬'
  },
  {
    id: 'glasses_ski',
    name: 'Masque de Ski',
    category: 'glasses',
    rarity: 'rare',
    price: 150,
    description: 'Parfait pour les aventures enneigées',
    emoji: '⛷️'
  },
  {
    id: 'glasses_laser',
    name: 'Lunettes Laser',
    category: 'glasses',
    rarity: 'legendary',
    price: 750,
    description: 'Vision aux rayons X et style futuriste',
    emoji: '🤖'
  },

  // === CHAUSSURES (7 items) ===
  {
    id: 'shoes_sneakers',
    name: 'Baskets',
    category: 'shoes',
    rarity: 'common',
    price: 50,
    description: 'Confortables pour toutes les aventures',
    emoji: '👟'
  },
  {
    id: 'shoes_heels',
    name: 'Talons Hauts',
    category: 'shoes',
    rarity: 'epic',
    price: 350,
    description: 'Pour un look élégant et raffiné',
    emoji: '👠'
  },
  {
    id: 'shoes_boots',
    name: 'Bottes de Combat',
    category: 'shoes',
    rarity: 'rare',
    price: 150,
    description: 'Robustes et stylées pour les guerriers',
    emoji: '👢'
  },
  {
    id: 'shoes_sandals',
    name: 'Sandales',
    category: 'shoes',
    rarity: 'common',
    price: 50,
    description: 'Parfaites pour l\'été et la plage',
    emoji: '👡'
  },
  {
    id: 'shoes_ballet',
    name: 'Chaussons de Ballet',
    category: 'shoes',
    rarity: 'rare',
    price: 150,
    description: 'Grâce et légèreté pour les danseurs',
    emoji: '🩰'
  },
  {
    id: 'shoes_rocket',
    name: 'Bottes Fusée',
    category: 'shoes',
    rarity: 'legendary',
    price: 750,
    description: 'Permet de voler dans les airs!',
    emoji: '🚀'
  },
  {
    id: 'shoes_hiking',
    name: 'Chaussures de Randonnée',
    category: 'shoes',
    rarity: 'common',
    price: 50,
    description: 'Idéales pour les explorateurs',
    emoji: '🥾'
  }
]

/**
 * Nombre total d'accessoires par catégorie
 */
export const ACCESSORIES_COUNT = {
  hat: SHOP_ACCESSORIES.filter(a => a.category === 'hat').length,
  glasses: SHOP_ACCESSORIES.filter(a => a.category === 'glasses').length,
  shoes: SHOP_ACCESSORIES.filter(a => a.category === 'shoes').length,
  total: SHOP_ACCESSORIES.length
}
