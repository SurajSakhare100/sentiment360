'use client'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import DashboardContent from '@/components/dashboard/DashboardContent'
import { MoveLeft } from 'lucide-react'
import Router from 'next/router'

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session?.user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        
        <h1 className="text-3xl font-bold text-primary-900 pl-16">
          <span className='flex items-center gap-2'>
            {/* <MoveLeft onClick={() => Router.push('/s')} className="cursor-pointer" /> */}
            Welcome back, {session.user.name}
          </span>
        </h1>
        <DashboardContent />
      </div>
    </div>
  )
} 