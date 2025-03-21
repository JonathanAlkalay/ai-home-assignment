import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/lib/api-service'
import { toast } from 'sonner'

export interface Post {
  id: number
  title: string
  content: string
  createdAt: string
  isDraft: boolean
}

// Query key factory
const queryKeys = {
  posts: ['posts'] as const,
  post: (id: number) => ['post', id] as const,
}

// Fetch all posts
export function usePosts() {
  return useQuery({
    queryKey: queryKeys.posts,
    queryFn: () => apiService.getUserPosts(),
  })
}

// Create post
export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { title: string; content: string; isDraft?: boolean }) =>
      apiService.savePost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts })
    },
  })
}

// Update post
export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { title: string; content: string } }) =>
      apiService.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

// Update draft status
export function useUpdateDraftStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isDraft }: { id: number; isDraft: boolean }) =>
      apiService.updateDraftStatus(id, isDraft),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts })
    },
  })
}

// Delete post
export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => apiService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts })
    },
  })
}

// Generate post content
export function useGeneratePost() {
  return useMutation({
    mutationFn: (data: { topic: string; style: string }) =>
      apiService.generatePost(data),
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to generate content')
    },
  })
} 