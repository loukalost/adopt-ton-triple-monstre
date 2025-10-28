'use server'

import connectDB from '@/db'
import { MonsterModel, type DBMonster } from '@/db/models/monster.model'
import { getAuthInstance } from '@/lib/auth'
import { Types } from 'mongoose'
// import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

// export async function createMonster (monsterData: CreateMonsterFormValues): Promise<void> {
//   await connectDB()

//   const auth = await getAuthInstance()
//   const session = await auth.api.getSession({
//     headers: await headers()
//   })
//   if (session === null || session === undefined) throw new Error('User not authenticated')

//   const monster = new MonsterModel({
//     ownerId: session.user.id,
//     name: monsterData.name,
//     traits: monsterData.traits,
//     state: monsterData.state,
//     level: monsterData.level
//   })

//   await monster.save()
//   revalidatePath('/dashboard')
// }

export async function getMonsters (): Promise<DBMonster[]> {
  try {
    await connectDB()
    const auth = await getAuthInstance()

    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) throw new Error('User not authenticated')

    const { user } = session

    const monsters = await MonsterModel.find({ ownerId: user.id }).exec()
    return JSON.parse(JSON.stringify(monsters))
  } catch (error) {
    console.error('Error fetching monsters:', error)
    return []
  }
}

export async function getMonsterById (id: string): Promise<DBMonster | null> {
  try {
    await connectDB()
    const auth = await getAuthInstance()
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) throw new Error('User not authenticated')
    const { user } = session

    const _id = id[0]

    if (!Types.ObjectId.isValid(_id)) {
      console.error('Invalid monster ID format')
      return null
    }

    const monster = await MonsterModel.findOne({ ownerId: user.id, _id }).exec()
    return JSON.parse(JSON.stringify(monster))
  } catch (error) {
    console.error('Error fetching monster:', error)
    return null
  }
}
