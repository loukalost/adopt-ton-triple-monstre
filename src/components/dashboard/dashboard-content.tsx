'use client'
import { useState } from 'react'
import Button from '../buttons/button'
import { authClient } from '@/lib/auth-client'
import MonsterModal from './monster-modal'
import MonsterForm from '../forms/monster-form'
import { authToasts } from '@/lib/toast'

type Session = typeof authClient.$Infer.Session

function DashboardContent ({ session }: { session: Session }): React.ReactNode {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const handleLogout = (): void => {
    void authClient.signOut()
    authToasts.signOutSuccess()
    setTimeout(() => {
      window.location.href = '/sign-in'
    }, 500) // Small delay to show toast
  }

  const handleCreateMonster = (): void => {
    setIsModalOpen(true)
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1 className='text-4xl font-bold mb-4'>Bienvenue {session.user.email} sur votre tableau de bord</h1>
      <Button variant='primary' onClick={handleCreateMonster}>Créer une créature</Button>
      <p className='text-lg text-gray-600'>Ici, vous pouvez gérer vos créatures et suivre votre progression.</p>
      <Button onClick={handleLogout}>
        Se déconnecter
      </Button>

      <MonsterModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <MonsterForm onSuccess={() => setIsModalOpen(false)} />
      </MonsterModal>
    </div>
  )
}

export default DashboardContent
