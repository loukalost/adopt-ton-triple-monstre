'use client'

import { redirectToDashboard } from '@/actions/navigation.actions'
import { useEffect } from 'react'
import { showError } from '@/lib/toast'

function ErrorClient (
  {
    error
  }:
  {
    error: Error | null | string
  }): React.ReactNode {
  useEffect(() => {
    const errorMessage = typeof error === 'string'
      ? error
      : error instanceof Error
        ? error.message
        : 'An unexpected error occurred'

    showError(errorMessage)
    void redirectToDashboard()
  }, [error])

  return (
    <div />
  )
}

export default ErrorClient
