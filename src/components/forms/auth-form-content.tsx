'use client'

import { useState } from 'react'
import SignUpForm from './signup-form'
import SignInForm from './signin-form'
import Button from '../buttons/button'

function AuthFormContent (): React.ReactNode {
  const [isSignIn, setIsSignIn] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  return (
    <div className='space-y-6'>
      {/* Error display */}
      {(error.length > 0) && (
        <div className='bg-red-50 border border-red-200 p-4 rounded-lg'>
          <div className='flex items-center gap-2'>
            <span className='text-red-600 text-lg'>⚠️</span>
            <p className='text-red-800 text-sm font-medium'>{error}</p>
          </div>
        </div>
      )}

      {/* Form container with smooth transition */}
      <div className='transition-all duration-300 ease-in-out'>
        {isSignIn
          ? (
            <div className='animate-in fade-in duration-300'>
              <SignInForm onError={setError} />
            </div>
            )
          : (
            <div className='animate-in fade-in duration-300'>
              <SignUpForm onError={setError} />
            </div>
            )}
      </div>

      {/* Toggle button */}
      <div className='text-center pt-4 border-t border-slate-200'>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => {
            setError('') // Clear errors when switching
            setIsSignIn(!isSignIn)
          }}
        >
          {isSignIn ? '🆕 Créer un compte' : '🔐 J\'ai déjà un compte'}
        </Button>
      </div>
    </div>
  )
}

export default AuthFormContent
