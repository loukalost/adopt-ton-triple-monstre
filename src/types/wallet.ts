/**
 * Interface représentant un wallet dans la base de données
 */
export interface DBWallet {
  _id: string
  ownerId: string
  balance: number
  createdAt: Date
  updatedAt: Date
}
