'use server'

import connectDB from '@/db'
import { InventoryModel } from '@/db/models/inventory.model'
import { MonsterModel } from '@/db/models/monster.model'
import { getAuthInstance } from '@/lib/auth'
import { headers } from 'next/headers'
import { SHOP_ACCESSORIES, SHOP_BACKGROUNDS } from '@/config/shop'
import { subtractKoins } from './wallet.actions'
import type { DBInventory, AccessoryCategory } from '@/types/monster'

/**
 * Actions serveur pour la gestion de l'inventaire et des équipements
 * Principe SRP: Responsabilité unique de gestion des opérations d'inventaire
 */

// ============================================
// INVENTAIRE - Récupération
// ============================================

/**
 * Récupère l'inventaire complet de l'utilisateur connecté
 * Crée automatiquement l'inventaire s'il n'existe pas
 *
 * @returns {Promise<DBInventory>} L'inventaire de l'utilisateur
 * @throws {Error} Si l'utilisateur n'est pas authentifié
 */
export async function getUserInventory (): Promise<DBInventory> {
  const auth = await getAuthInstance()
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session?.user?.id === null || session?.user?.id === undefined) {
    throw new Error('Utilisateur non authentifié')
  }

  await connectDB()

  // Rechercher l'inventaire existant
  let inventory = await InventoryModel.findOne({ userId: session.user.id })

  // Créer l'inventaire s'il n'existe pas
  if (inventory === null || inventory === undefined) {
    inventory = await InventoryModel.create({
      userId: session.user.id,
      accessories: [],
      backgrounds: []
    })
  }

  return inventory.toObject() as DBInventory
}

// ============================================
// ACHATS - Accessoires et Arrière-plans
// ============================================

/**
 * Achète un accessoire depuis la boutique
 * Débite les Koins du wallet et ajoute l'accessoire à l'inventaire
 *
 * @param {string} accessoryId - L'ID de l'accessoire à acheter
 * @returns {Promise<DBInventory>} L'inventaire mis à jour
 * @throws {Error} Si l'accessoire n'existe pas, est déjà possédé, ou si les Koins sont insuffisants
 */
export async function purchaseAccessory (accessoryId: string): Promise<DBInventory> {
  const auth = await getAuthInstance()
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session?.user?.id === null || session?.user?.id === undefined) {
    throw new Error('Utilisateur non authentifié')
  }

  // Vérifier que l'accessoire existe dans le catalogue
  const accessory = SHOP_ACCESSORIES.find(a => a.id === accessoryId)
  if (accessory == null) {
    throw new Error('Accessoire introuvable dans le catalogue')
  }

  await connectDB()

  // Récupérer l'inventaire
  const inventory = await InventoryModel.findOne({ userId: session.user.id })
  if (inventory == null) {
    throw new Error('Inventaire introuvable')
  }

  // Vérifier si l'accessoire n'est pas déjà possédé
  if (inventory.accessories.includes(accessoryId) === true) {
    throw new Error('Vous possédez déjà cet accessoire')
  }

  // Débiter les Koins (gère automatiquement la vérification du solde)
  await subtractKoins(accessory.price)

  // Ajouter l'accessoire à l'inventaire
  inventory.accessories.push(accessoryId)
  await inventory.save()

  return inventory.toObject() as DBInventory
}

/**
 * Achète un arrière-plan depuis la boutique
 * Débite les Koins du wallet et ajoute l'arrière-plan à l'inventaire
 *
 * @param {string} backgroundId - L'ID de l'arrière-plan à acheter
 * @returns {Promise<DBInventory>} L'inventaire mis à jour
 * @throws {Error} Si l'arrière-plan n'existe pas, est déjà possédé, ou si les Koins sont insuffisants
 */
export async function purchaseBackground (backgroundId: string): Promise<DBInventory> {
  const auth = await getAuthInstance()
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session?.user?.id === null || session?.user?.id === undefined) {
    throw new Error('Utilisateur non authentifié')
  }

  // Vérifier que l'arrière-plan existe dans le catalogue
  const background = SHOP_BACKGROUNDS.find(bg => bg.id === backgroundId)
  if (background == null) {
    throw new Error('Arrière-plan introuvable dans le catalogue')
  }

  await connectDB()

  // Récupérer l'inventaire
  const inventory = await InventoryModel.findOne({ userId: session.user.id })
  if (inventory == null) {
    throw new Error('Inventaire introuvable')
  }

  // Vérifier si l'arrière-plan n'est pas déjà possédé
  if (inventory.backgrounds.includes(backgroundId) === true) {
    throw new Error('Vous possédez déjà cet arrière-plan')
  }

  // Débiter les Koins (gère automatiquement la vérification du solde)
  await subtractKoins(background.price)

  // Ajouter l'arrière-plan à l'inventaire
  inventory.backgrounds.push(backgroundId)
  await inventory.save()

  return inventory.toObject() as DBInventory
}

// ============================================
// ÉQUIPEMENT - Accessoires
// ============================================

/**
 * Équipe un accessoire sur un monstre
 * Vérifie que l'utilisateur possède l'accessoire et est propriétaire du monstre
 *
 * @param {string} monsterId - L'ID du monstre
 * @param {AccessoryCategory} category - La catégorie de l'accessoire (hat, glasses, shoes)
 * @param {string} accessoryId - L'ID de l'accessoire à équiper
 * @returns {Promise<void>}
 * @throws {Error} Si le monstre n'existe pas, l'accessoire n'est pas possédé, ou l'utilisateur n'est pas propriétaire
 */
export async function equipAccessory (
  monsterId: string,
  category: AccessoryCategory,
  accessoryId: string
): Promise<void> {
  const auth = await getAuthInstance()
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session?.user?.id === null || session?.user?.id === undefined) {
    throw new Error('Utilisateur non authentifié')
  }

  await connectDB()

  // Vérifier que le monstre existe et appartient à l'utilisateur
  const monster = await MonsterModel.findById(monsterId)
  if (monster === null || monster === undefined) {
    throw new Error('Monstre introuvable')
  }

  if (monster.ownerId !== session.user.id) {
    throw new Error('Vous n\'êtes pas propriétaire de ce monstre')
  }

  // Vérifier que l'utilisateur possède l'accessoire
  const inventory = await InventoryModel.findOne({ userId: session.user.id })
  if (inventory == null) {
    throw new Error('Inventaire introuvable')
  }

  if (inventory.accessories.includes(accessoryId) === false) {
    throw new Error('Vous ne possédez pas cet accessoire')
  }

  // Vérifier que l'accessoire appartient bien à la catégorie demandée
  const accessory = SHOP_ACCESSORIES.find(a => a.id === accessoryId)
  if (accessory?.category !== category) {
    throw new Error('Catégorie d\'accessoire incorrecte')
  }

  // Équiper l'accessoire
  if (monster.equipment == null) {
    monster.equipment = {}
  }

  monster.equipment[category] = accessoryId
  monster.markModified('equipment')
  await monster.save()
}

/**
 * Retire un accessoire d'un monstre
 *
 * @param {string} monsterId - L'ID du monstre
 * @param {AccessoryCategory} category - La catégorie de l'accessoire à retirer
 * @returns {Promise<void>}
 * @throws {Error} Si le monstre n'existe pas ou l'utilisateur n'est pas propriétaire
 */
export async function unequipAccessory (
  monsterId: string,
  category: AccessoryCategory
): Promise<void> {
  const auth = await getAuthInstance()
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session?.user?.id === null || session?.user?.id === undefined) {
    throw new Error('Utilisateur non authentifié')
  }

  await connectDB()

  // Vérifier que le monstre existe et appartient à l'utilisateur
  const monster = await MonsterModel.findById(monsterId)
  if (monster === null || monster === undefined) {
    throw new Error('Monstre introuvable')
  }

  if (monster.ownerId !== session.user.id) {
    throw new Error('Vous n\'êtes pas propriétaire de ce monstre')
  }

  // Retirer l'accessoire
  if (monster.equipment !== null && monster.equipment !== undefined) {
    monster.equipment[category] = undefined
    monster.markModified('equipment')
    await monster.save()
  }
}

// ============================================
// ÉQUIPEMENT - Arrière-plans
// ============================================

/**
 * Équipe un arrière-plan sur un monstre
 * Vérifie que l'utilisateur possède l'arrière-plan et est propriétaire du monstre
 *
 * @param {string} monsterId - L'ID du monstre
 * @param {string} backgroundId - L'ID de l'arrière-plan à équiper
 * @returns {Promise<void>}
 * @throws {Error} Si le monstre n'existe pas, l'arrière-plan n'est pas possédé, ou l'utilisateur n'est pas propriétaire
 */
export async function equipBackground (
  monsterId: string,
  backgroundId: string
): Promise<void> {
  const auth = await getAuthInstance()
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session?.user?.id === null || session?.user?.id === undefined) {
    throw new Error('Utilisateur non authentifié')
  }

  await connectDB()

  // Vérifier que le monstre existe et appartient à l'utilisateur
  const monster = await MonsterModel.findById(monsterId)
  if (monster === null || monster === undefined) {
    throw new Error('Monstre introuvable')
  }

  if (monster.ownerId !== session.user.id) {
    throw new Error('Vous n\'êtes pas propriétaire de ce monstre')
  }

  // Vérifier que l'utilisateur possède l'arrière-plan
  const inventory = await InventoryModel.findOne({ userId: session.user.id })
  if (inventory == null) {
    throw new Error('Inventaire introuvable')
  }

  if (inventory.backgrounds.includes(backgroundId) === false) {
    throw new Error('Vous ne possédez pas cet arrière-plan')
  }

  // Équiper l'arrière-plan
  monster.background = backgroundId
  await monster.save()
}

/**
 * Retire l'arrière-plan d'un monstre
 *
 * @param {string} monsterId - L'ID du monstre
 * @returns {Promise<void>}
 * @throws {Error} Si le monstre n'existe pas ou l'utilisateur n'est pas propriétaire
 */
export async function unequipBackground (monsterId: string): Promise<void> {
  const auth = await getAuthInstance()
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session?.user?.id === null || session?.user?.id === undefined) {
    throw new Error('Utilisateur non authentifié')
  }

  await connectDB()

  // Vérifier que le monstre existe et appartient à l'utilisateur
  const monster = await MonsterModel.findById(monsterId)
  if (monster === null || monster === undefined) {
    throw new Error('Monstre introuvable')
  }

  if (monster.ownerId !== session.user.id) {
    throw new Error('Vous n\'êtes pas propriétaire de ce monstre')
  }

  // Retirer l'arrière-plan
  monster.background = undefined
  await monster.save()
}
