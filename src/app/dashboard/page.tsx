import DashboardContent from '@/components/dashboard/dashboard-content'
import { AppLayout } from '@/components/navigation'
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
    <AppLayout>
      <DashboardContent session={session} />
    </AppLayout>
  )
}

export default DashboardPage
