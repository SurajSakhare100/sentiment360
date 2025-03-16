import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import DashboardContent from '@/components/dashboard/DashboardContent'

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session?.user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-900 pl-32">
          Welcome back, {session.user.name}
        </h1>
        <DashboardContent />
      </div>
    </div>
  )
} 