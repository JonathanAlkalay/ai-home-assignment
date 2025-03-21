"use client"

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '@/lib/api-service'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function PostPage() {
  const { id } = useParams()

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => apiService.getPost(id as string),
  })

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/4 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
          <p className="text-gray-600">
            {error instanceof Error ? error.message : 'Failed to load post'}
          </p>
        </Card>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
          <p className="text-gray-600">
            The post you're looking for doesn't exist or has been removed.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card className="p-6">
        <article className="prose prose-slate max-w-none">
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <span>By {post.user?.firstName} {post.user?.lastName}</span>
            <span>•</span>
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString()}
            </time>
          </div>
          <div className="whitespace-pre-wrap">{post.content}</div>
        </article>
      </Card>
    </div>
  )
} 