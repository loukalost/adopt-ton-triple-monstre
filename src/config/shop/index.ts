/**
 * Barrel exports pour la configuration de la boutique
 * Principe ISP: Exportation modulaire pour n'importer que ce qui est nécessaire
 */

// Rarity configuration
export {
  RARITY_COLORS,
  RARITY_LABELS,
  RARITY_ICONS,
  RARITY_MULTIPLIERS,
  RARITY_DROP_RATES
} from './rarity-config'

// Accessories catalog
export {
  SHOP_ACCESSORIES,
  ACCESSORIES_COUNT
} from './accessories'

// Backgrounds catalog
export {
  SHOP_BACKGROUNDS,
  BACKGROUNDS_COUNT
} from './backgrounds'
