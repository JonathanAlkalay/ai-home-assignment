'use client'

import { LoginForm } from '@/components/auth/login-form'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <div className="container mx-auto flex h-screen items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <h1 className="mb-6 text-center text-2xl font-bold">Welcome Back!</h1>
        <p className="mb-8 text-center text-gray-600">
          Please sign in to continue to your dashboard.
        </p>
        <LoginForm />
      </Card>
    </div>
  )
} 