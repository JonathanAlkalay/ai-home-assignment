'use client';

import { useMutation } from '@tanstack/react-query'
import { apiService } from '@/lib/api-service'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials extends LoginCredentials {
  firstName: string
  lastName: string
}

export const useLogin = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const result = await apiService.login(data.email, data.password)
      return result
    },
    onSuccess: () => {
      toast.success('Logged in successfully')
      router.push('/dashboard')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useRegister = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      const result = await apiService.register(data)
      return result
    },
    onSuccess: () => {
      toast.success('Account created successfully')
      router.push('/dashboard')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
} 