"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Cookies from 'js-cookie'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    // Remove token from both localStorage and cookies
    localStorage.removeItem("token")
    Cookies.remove("token", { path: '/' })
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">AI Blog Generator</h1>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </nav>
      <main className="container mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  )
} 