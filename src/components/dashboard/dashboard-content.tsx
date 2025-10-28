'use client'
import { useState, useEffect } from 'react'
import Button from '../buttons/button'
import { authClient } from '@/lib/auth-client'
import MonsterModal from './monster-modal'
import MonsterForm from '../forms/monster-form'
import { authToasts } from '@/lib/toast'
import { MonstersList } from '@/components/monsters'
import { getMonsters } from '@/actions/monsters.actions'
import type { DBMonster } from '@/db/models/monster.model'

type Session = typeof authClient.$Infer.Session

function DashboardContent ({ session }: { session: Session }): React.ReactNode {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [monsters, setMonsters] = useState<DBMonster[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchMonsters = async (): Promise<void> => {
      setIsLoading(true)
      try {
        const data = await getMonsters()
        setMonsters(data)
      } catch (error) {
        console.error('Error loading monsters:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchMonsters()
  }, [])

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

  const handleMonsterCreated = (): void => {
    setIsModalOpen(false)
    // Rafraîchir la liste des monstres après création
    void (async () => {
      try {
        const data = await getMonsters()
        setMonsters(data)
      } catch (error) {
        console.error('Error refreshing monsters:', error)
      }
    })()
  }

  return (
    <div className='flex min-h-screen flex-col bg-slate-50 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='mx-auto w-full max-w-7xl'>
        {/* Header section avec titre et actions */}
        <header className='mb-10 space-y-4'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='space-y-2'>
              <h1 className='text-3xl font-bold text-slate-900 sm:text-4xl'>
                Bienvenue, {session.user.email}
              </h1>
              <p className='text-base text-slate-600'>
                Gérez vos créatures et suivez votre progression
              </p>
            </div>

            <div className='flex flex-wrap gap-3'>
              <Button variant='primary' onClick={handleCreateMonster}>
                ✨ Créer une créature
              </Button>
              <Button variant='outline' onClick={handleLogout}>
                Se déconnecter
              </Button>
            </div>
          </div>
        </header>

        {/* Liste des monstres */}
        {isLoading
          ? (
            <div className='flex items-center justify-center py-20'>
              <div className='text-center space-y-3'>
                <div className='inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-slate-900 border-r-transparent' />
                <p className='text-sm font-medium text-slate-700'>Chargement de vos créatures...</p>
              </div>
            </div>
            )
          : (
            <MonstersList monsters={monsters} />
            )}
      </div>

      <MonsterModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <MonsterForm onSuccess={handleMonsterCreated} />
      </MonsterModal>
    </div>
  )
}

export default DashboardContent
