import mongoose, { type Document } from 'mongoose'

/**
 * Interface pour l'inventaire utilisateur dans MongoDB
 */
export interface DBInventory extends Document {
  userId: string
  accessories: string[] // Array d'IDs d'accessoires possédés
  backgrounds: string[] // Array d'IDs d'arrière-plans possédés
  createdAt: Date
  updatedAt: Date
}

const { Schema } = mongoose

/**
 * Schéma MongoDB pour l'inventaire utilisateur
 * Principe SRP: Responsabilité unique de définition du schéma inventaire
 */
const inventorySchema = new Schema<DBInventory>({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    unique: true,
    index: true
  },
  accessories: {
    type: [String],
    default: []
  },
  backgrounds: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
  collection: 'inventories'
})

// Index pour requêtes rapides par userId
inventorySchema.index({ userId: 1 })

export const InventoryModel = mongoose.models.Inventory ?? mongoose.model<DBInventory>('Inventory', inventorySchema)
