import { getMonsterById } from '@/actions/monsters.actions'
import ErrorClient from '@/components/error-client'
import { AppLayout } from '@/components/navigation'

async function CreaturePage ({ params }: { params: { id: string } }): Promise<React.ReactNode> {
  const { id } = await params
  const monster = await getMonsterById(id)

  if (monster === null || monster === undefined) {
    return <ErrorClient error='Creature not found.' />
  }

  return (
    <AppLayout>
      <div>
        <h1>Creature Page</h1>
        <p>Creature ID: {id}</p>
      </div>
    </AppLayout>
  )
}

export default CreaturePage
