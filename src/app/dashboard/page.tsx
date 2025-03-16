"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import DashboardContent from '@/components/dashboard/DashboardContent'
import { MoveLeftIcon } from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isGuest, setIsGuest] = useState(false)
  const [userName, setUserName] = useState("Guest")

  useEffect(() => {
    // Check if user is authenticated or has a guest token
    const guestToken = localStorage.getItem("guestToken")
    
    if (status === "unauthenticated" && !guestToken) {
      router.push('/signin')
    } else if (guestToken && status !== "authenticated") {
      setIsGuest(true)
    } else if (session?.user?.name) {
      setUserName(session.user.name)
    }
  }, [status, router, session])

  if (status === "loading" && !isGuest) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-900 pl-16">
          <span className='flex items-center gap-2'>
            <MoveLeftIcon onClick={() => router.push('/')} className="cursor-pointer" />
            Welcome back, {userName}
          </span>
        </h1>
        <DashboardContent />
      </div>
    </div>
  )
} 