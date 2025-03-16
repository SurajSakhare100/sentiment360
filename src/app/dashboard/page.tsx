"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import DashboardContent from '@/components/dashboard/DashboardContent'
import { MoveLeftIcon, LogOutIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

  const handleLogout = () => {
    if (isGuest) {
      localStorage.removeItem("guestToken")
      router.push('/signin')
    } else {
      signOut({ callbackUrl: '/signin' })
    }
  }

  if (status === "loading" && !isGuest) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 px-4">
          <div className="flex items-center gap-2 mb-4 sm:mb-0 ">
            <MoveLeftIcon 
              onClick={() => router.push('/')} 
              className="cursor-pointer" 
              size={24}
            />
            <h1 className="text-xl sm:text-3xl font-bold text-primary-900">
              Welcome back, {userName}
            </h1>
          </div>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOutIcon size={18} />
            <span>Logout</span>
          </Button>
        </div>
        
        <DashboardContent />
      </div>
    </div>
  )
} 