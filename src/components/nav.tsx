"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"
import logo from "../../public/images/logo.png"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Nav() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="#features">
            <Button variant="ghost">Features</Button>
          </Link>
          <Link href="#pricing">
            <Button variant="ghost">Pricing</Button>
          </Link>
          
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

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t py-4 px-6 bg-background shadow-lg">
          <div className="flex flex-col space-y-4">
            <Link href="/#features" onClick={toggleMenu}>
              <Button variant="ghost" className="w-full justify-start">Features</Button>
            </Link>
            <Link href="/#pricing" onClick={toggleMenu}>
              <Button variant="ghost" className="w-full justify-start">Pricing</Button>
            </Link>
            
            {status === "authenticated" ? (
              <>
                <Link href="/dashboard" onClick={toggleMenu}>
                  <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    toggleMenu()
                    signOut({ callbackUrl: '/' })
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin" onClick={toggleMenu}>
                  <Button variant="ghost" className="w-full justify-start">Sign In</Button>
                </Link>
                <Link href="/signin" onClick={toggleMenu}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
} 