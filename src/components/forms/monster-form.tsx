'use client'
import React, { useState } from 'react'
import InputField from '@/components/inputs/input'
import Button from '@/components/buttons/button'
import PixelBlackCat, { type PixelBlackCatState } from '@/components/monsters/black-cat'
import MonsterTraitsDisplay from '@/components/monsters/monster-traits-display'
import {
  DEFAULT_MONSTER_LEVEL,
  DEFAULT_MONSTER_STATE,
  MONSTER_STATES,
  type MonsterState
} from '@/types/monsters/domain'
import {
  type MonsterCreationPayload,
  type MonsterFormErrors,
  type MonsterFormProps,
  type MonsterFormValues
} from '@/types/forms/monster-form'
import { validateMonsterFormValues } from '@/services/monsters/validation'
import {
  generateUniqueMonsterTraits,
  serializeTraits,
  type MonsterTraits
} from '@/services/monster-generator.service'
import { monsterToasts, showError, showWarning } from '@/lib/toast'

async function defaultSubmit (payload: MonsterCreationPayload): Promise<void> {
  const response = await fetch('/api/monsters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error('La création de la créature a échoué')
  }
}

const STATE_TO_PIXEL_STATE: Record<MonsterState, PixelBlackCatState> = {
  happy: 'happy',
  sad: 'idle',
  angry: 'idle',
  hungry: 'idle',
  sleepy: 'sleep'
}

function MonsterForm ({ onSubmit, onSuccess }: MonsterFormProps): React.ReactNode {
  const [values, setValues] = useState<MonsterFormValues>({
    name: '',
    draw: ''
  })
  const [errors, setErrors] = useState<MonsterFormErrors>({})
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [generalError, setGeneralError] = useState<string>('')
  const [generatedMonsterState, setGeneratedMonsterState] = useState<MonsterState | null>(null)
  const [generatedTraits, setGeneratedTraits] = useState<MonsterTraits | null>(null)
  const [previewState, setPreviewState] = useState<PixelBlackCatState>('idle')

  const submitHandler = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    void handleSubmit()
  }

  const handleGenerateMonster = (): void => {
    const nextMonsterState = MONSTER_STATES[Math.floor(Math.random() * MONSTER_STATES.length)]
    const traits = generateUniqueMonsterTraits()

    setGeneratedMonsterState(nextMonsterState)
    setGeneratedTraits(traits)
    setPreviewState(STATE_TO_PIXEL_STATE[nextMonsterState])
  }

  const handleStateSelection = (state: MonsterState): void => {
    setGeneratedMonsterState(state)
    setPreviewState(STATE_TO_PIXEL_STATE[state])
  }

  const handleSubmit = async (): Promise<void> => {
    const validation = validateMonsterFormValues(values)
    setErrors(validation)

    if (Object.keys(validation).length > 0) {
      showWarning('Veuillez remplir tous les champs requis')
      return
    }

    // Validate that monster has been generated
    if (generatedTraits === null) {
      const errorMsg = 'Veuillez générer un monstre avant de soumettre'
      setGeneralError(errorMsg)
      showWarning(errorMsg)
      return
    }

    setSubmitting(true)
    setGeneralError('')

    const submission = onSubmit ?? defaultSubmit

    try {
      const payload: MonsterCreationPayload = {
        ...values,
        level: DEFAULT_MONSTER_LEVEL,
        state: generatedMonsterState ?? DEFAULT_MONSTER_STATE,
        traits: serializeTraits(generatedTraits)
      }
      await submission(payload)

      // Success notification
      monsterToasts.created(values.name)

      setValues({ name: '', draw: '' })
      setErrors({})
      setGeneratedMonsterState(null)
      setGeneratedTraits(null)
      setPreviewState('idle')
      if (typeof onSuccess === 'function') onSuccess()
    } catch (error) {
      const errorMsg = (error as Error).message
      setGeneralError(errorMsg)
      showError(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submitHandler} className='space-y-4'>
      <InputField
        label='Nom'
        value={values.name}
        onChangeText={(value) => setValues((prev) => ({ ...prev, name: value }))}
        error={errors.name}
      />

      <InputField
        label='Dessin (URL ou référence)'
        value={values.draw}
        onChangeText={(value) => setValues((prev) => ({ ...prev, draw: value }))}
        error={errors.draw}
      />

      {generalError.length > 0 && (
        <div className='rounded-lg bg-red-100 p-3 text-sm text-red-600'>
          {generalError}
        </div>
      )}

      <div className='space-y-3 rounded-xl border border-purple-200/40 bg-purple-50/30 p-4'>
        <div className='space-y-1'>
          <p className='font-semibold text-purple-900'>Apercu du monstre</p>
          <p className='text-sm text-purple-700'>Utilise la génération pour obtenir un aperçu du Pixel Black Cat.</p>
        </div>
        <div className='flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between'>
          <div className='w-full sm:max-w-xs'>
            <Button type='button' variant='outline' onClick={handleGenerateMonster}>
              Générer un monstre
            </Button>
            <div className='mt-4 grid grid-cols-2 gap-2'>
              {MONSTER_STATES.map((state) => {
                const isActive = generatedMonsterState === state
                return (
                  <button
                    key={state}
                    type='button'
                    onClick={() => { handleStateSelection(state) }}
                    disabled={submitting}
                    className={`rounded-lg border border-purple-400/40 px-3 py-2 text-xs uppercase transition-colors duration-300 ${isActive ? 'bg-purple-600 text-white' : 'bg-white/40 text-purple-700 hover:bg-purple-100'}`}
                  >
                    {state}
                  </button>
                )
              })}
            </div>
          </div>
          <div className='w-full sm:max-w-sm'>
            {generatedMonsterState !== null && generatedTraits !== null
              ? (
                <div className='space-y-4'>
                  <PixelBlackCat state={previewState} layout='compact' showControls={false} />
                  <div className='rounded-lg bg-white/60 p-3'>
                    <p className='mb-2 text-center font-mono text-xs uppercase tracking-[0.2em] text-purple-600'>
                      État : {generatedMonsterState}
                    </p>
                    <MonsterTraitsDisplay traits={generatedTraits} variant='detailed' />
                  </div>
                </div>
                )
              : (
                <div className='rounded-lg border border-dashed border-purple-300/60 bg-white/30 p-6 text-center text-sm text-purple-500'>
                  Clique sur "Générer un monstre" pour découvrir ses caractéristiques.
                </div>
                )}
          </div>
        </div>
      </div>

      <div className='flex justify-end gap-3'>
        <Button type='submit' variant='primary' disabled={submitting}>
          {submitting ? 'Création en cours...' : 'Créer la créature'}
        </Button>
      </div>
    </form>
  )
}

export default MonsterForm
