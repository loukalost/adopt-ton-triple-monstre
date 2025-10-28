import mongoose, { type Document } from 'mongoose'

export interface DBMonster extends Document {
  name: string
  level: number
  draw: string
  traits: string // JSON string of MonsterTraits
  state: 'happy' | 'sad' | 'angry' | 'hungry' | 'sleepy'
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

const { Schema } = mongoose

const monsterSchema = new Schema<DBMonster>({
  name: {
    type: String,
    required: [true, 'Monster name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  level: {
    type: Number,
    default: 1,
    min: [1, 'Level must be at least 1'],
    max: [100, 'Level cannot exceed 100']
  },
  draw: {
    type: String,
    required: [true, 'Monster draw/design is required']
  },
  traits: {
    type: String,
    required: [true, 'Monster traits are required']
  },
  state: {
    type: String,
    required: [true, 'Monster state is required'],
    enum: ['happy', 'sad', 'angry', 'hungry', 'sleepy'],
    default: 'hungry'
  },
  ownerId: {
    type: String,
    required: [true, 'Owner ID is required'],
    index: true
  }
}, {
  timestamps: true,
  collection: 'monsters'
})

monsterSchema.index({ ownerId: 1, createdAt: -1 })

export const MonsterModel = mongoose.models.Monster ?? mongoose.model<DBMonster>('Monster', monsterSchema)
