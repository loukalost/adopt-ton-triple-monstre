import type { MonsterState } from '@/types/monsters/domain'

export interface MonsterFormValues {
  name: string
  draw: string
}

export interface MonsterCreationPayload extends MonsterFormValues {
  level: number
  state: MonsterState
  traits: string // JSON serialized MonsterTraits
}

export type MonsterFormErrors = Partial<Record<keyof MonsterFormValues, string>>

export interface MonsterFormProps {
  onSubmit?: (payload: MonsterCreationPayload) => Promise<void> | void
  onSuccess?: () => void
}
