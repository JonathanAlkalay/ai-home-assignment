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

export function useLogin() {
  const router = useRouter()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      apiService.login(credentials.email, credentials.password),
    onSuccess: (data) => {
      toast.success('Logged in successfully')
      router.push('/dashboard')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to login')
    },
  })
}

export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      apiService.register({
        email: credentials.email,
        password: credentials.password,
        firstName: credentials.firstName,
        lastName: credentials.lastName
      }),
    onSuccess: () => {
      toast.success('Registered successfully')
      router.push('/dashboard')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to register')
    },
  })
} 