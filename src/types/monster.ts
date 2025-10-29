// Monster States
export const MONSTER_STATES = ['happy', 'sad', 'angry', 'hungry', 'sleepy'] as const
export type MonsterState = typeof MONSTER_STATES[number]

// Default values
export const DEFAULT_MONSTER_LEVEL = 1
export const DEFAULT_MONSTER_STATE: MonsterState = MONSTER_STATES[0]

// Monster Visual Styles
export type MonsterStyle = 'round' | 'square' | 'tall' | 'wide'
export type EyeStyle = 'big' | 'small' | 'star' | 'sleepy'
export type AntennaStyle = 'single' | 'double' | 'curly' | 'none'
export type AccessoryStyle = 'horns' | 'ears' | 'tail' | 'none'

// Monster Traits Interface
export interface MonsterTraits {
  bodyColor: string
  accentColor: string
  eyeColor: string
  antennaColor: string
  bobbleColor: string
  cheekColor: string
  bodyStyle: MonsterStyle
  eyeStyle: EyeStyle
  antennaStyle: AntennaStyle
  accessory: AccessoryStyle
}

// Database Monster Type
export interface DBMonster {
  _id: string
  name: string
  level: number
  xp: number
  maxXp: number
  traits: string // JSON serialized MonsterTraits
  state: MonsterState
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

// Re-export form types
export type {
  MonsterCreationPayload,
  MonsterFormErrors,
  MonsterFormProps,
  MonsterFormValues
} from './forms/monster-form'

// Re-export shop types (if exists)
export type {
  AccessoryCategory,
  AccessoryRarity,
  ShopAccessory,
  ShopBackground,
  EquippedAccessories,
  MonsterEquipment,
  InventoryItem,
  UserInventory,
  DBInventory
} from './shop'
