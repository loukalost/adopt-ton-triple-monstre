import { type MonsterFormErrors, type MonsterFormValues } from '@/types/forms/monster-form'

export const MONSTER_NAME_MIN_LENGTH = 2

export function validateMonsterFormValues (values: MonsterFormValues): MonsterFormErrors {
  const errors: MonsterFormErrors = {}

  if (values.name.trim().length < MONSTER_NAME_MIN_LENGTH) {
    errors.name = `Le nom doit contenir au moins ${MONSTER_NAME_MIN_LENGTH} caractères`
  }

  if (values.draw.trim().length === 0) {
    errors.draw = 'Le dessin est requis'
  }

  return errors
}
