"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGuestLogin = async () => {
    setIsLoading(true)
    
    // Store a guest token in localStorage
    localStorage.setItem("guestToken", "guest-" + Date.now())
    
    // Redirect to dashboard
    router.push("/dashboard")
    
    setIsLoading(false)
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>
            Choose how you want to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              disabled={isLoading}
            >
              <Image 
                src="/google-logo.svg" 
                alt="Google" 
                width={20} 
                height={20} 
              />
              Continue with Google
            </Button>
            
            <Button 
              className="w-full"
              onClick={handleGuestLogin}
              disabled={isLoading}
            >
              Continue as Guest
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 