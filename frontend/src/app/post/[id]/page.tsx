"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePost } from "@/hooks/use-posts"
import { format } from "date-fns"

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const { data: post, isLoading, error } = usePost(params.id as string)

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </Card>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">
            This post may not exist or is not publicly available.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
            <div className="text-sm text-gray-500">
              {format(new Date(post.createdAt), "PPP")}
            </div>
          </div>
          <Badge variant={post.isDraft ? "secondary" : "default"}>
            {post.isDraft ? "Draft" : "Published"}
          </Badge>
        </div>
        <div className="prose max-w-none">
          {post.content.split("\n").map((paragraph: string, index: number) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-6">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  )
} 