import DashboardContent from '@/components/dashboard/dashboard-content'
import { getAuthInstance } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

async function DashboardPage (): Promise<React.ReactNode> {
  const auth = await getAuthInstance()
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  return (
    <DashboardContent session={session} />
  )
}

export default DashboardPage
