"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"
import logo from "../../public/images/logo.png"
export function Nav() {
  const { data: session, status } = useSession()

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 ">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src={logo}
              alt="Sentiment360 Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <span className="font-bold text-xl">Sentiment360</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          
          
          {status === "authenticated" ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signin">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
} 