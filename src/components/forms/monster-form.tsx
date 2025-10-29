'use client'
import React, { useState } from 'react'
import InputField from '@/components/inputs/input'
import Button from '@/components/buttons/button'
import { PixelMonster } from '@/components/monsters/pixel-monster'
import {
  DEFAULT_MONSTER_LEVEL,
  DEFAULT_MONSTER_STATE,
  MONSTER_STATES,
  type MonsterState,
  type MonsterTraits
} from '@/types/monster'
import {
  type MonsterCreationPayload,
  type MonsterFormErrors,
  type MonsterFormProps,
  type MonsterFormValues
} from '@/types/forms/monster-form'
import { validateMonsterFormValues } from '@/services/monsters/validation'
import { generateRandomTraits } from '@/services/monster-generator.service'
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
  const [previewState, setPreviewState] = useState<MonsterState>('happy')

  const submitHandler = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    void handleSubmit()
  }

  const handleGenerateMonster = (): void => {
    const nextMonsterState = MONSTER_STATES[Math.floor(Math.random() * MONSTER_STATES.length)]
    const traits = generateRandomTraits()

    setGeneratedMonsterState(nextMonsterState)
    setGeneratedTraits(traits)
    setPreviewState(nextMonsterState)
  }

  const handleStateSelection = (state: MonsterState): void => {
    setGeneratedMonsterState(state)
    setPreviewState(state)
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
        traits: JSON.stringify(generatedTraits)
      }
      await submission(payload)

      // Success notification
      monsterToasts.created(values.name)

      setValues({ name: '', draw: '' })
      setErrors({})
      setGeneratedMonsterState(null)
      setGeneratedTraits(null)
      setPreviewState('happy')
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

      <div className='space-y-3 rounded-xl border border-moccaccino-200/40 bg-moccaccino-50/30 p-4'>
        <div className='space-y-1'>
          <p className='font-semibold text-moccaccino-900'>Aperçu du monstre</p>
          <p className='text-sm text-moccaccino-700'>Génère ton monstre et visualise-le dans différents états.</p>
        </div>
        <div className='flex flex-col items-center gap-4'>
          <Button type='button' variant='outline' onClick={handleGenerateMonster}>
            🎲 Générer un monstre aléatoire
          </Button>

          {generatedMonsterState !== null && generatedTraits !== null && (
            <div className='w-full space-y-4'>
              <div className='flex justify-center rounded-lg bg-slate-50 p-8'>
                <PixelMonster
                  traits={generatedTraits}
                  state={previewState}
                  level={1}
                />
              </div>

              <div className='space-y-2'>
                <p className='text-center text-xs font-semibold uppercase tracking-wider text-moccaccino-600'>
                  Sélectionne un état
                </p>
                <div className='grid grid-cols-5 gap-2'>
                  {MONSTER_STATES.map((state) => {
                    const isActive = previewState === state
                    return (
                      <button
                        key={state}
                        type='button'
                        onClick={() => { handleStateSelection(state) }}
                        disabled={submitting}
                        className={`rounded-lg border px-2 py-2 text-xs capitalize transition-all duration-300 ${isActive ? 'border-moccaccino-500 bg-moccaccino-500 text-white shadow-md scale-105' : 'border-moccaccino-200 bg-white text-moccaccino-700 hover:bg-moccaccino-100'}`}
                      >
                        {state}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {(generatedMonsterState === null || generatedTraits === null) && (
            <div className='rounded-lg border border-dashed border-moccaccino-300 bg-white/50 p-8 text-center text-sm text-moccaccino-500'>
              🎨 Clique sur le bouton pour générer ton monstre unique !
            </div>
          )}
        </div>
      </div>

      <div className='flex justify-end gap-3'>
        <Button type='submit' variant='primary' disabled={submitting}>
          {submitting ? '⏳ Création en cours...' : '✨ Créer la créature'}
        </Button>
      </div>
    </form>
  )
}

export default MonsterForm
