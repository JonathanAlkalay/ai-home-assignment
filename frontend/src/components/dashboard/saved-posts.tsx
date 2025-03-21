"use client"

import { useState } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { usePosts, useUpdatePost, useUpdateDraftStatus, useDeletePost, Post } from "@/hooks/use-posts"
import {
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  Share2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface EditingPost {
  id: number
  title: string
  content: string
}

export default function SavedPosts() {
  const router = useRouter()
  const { data: posts = [], isLoading } = usePosts()
  const updatePost = useUpdatePost()
  const updateDraftStatus = useUpdateDraftStatus()
  const deletePost = useDeletePost()
  const [editingPost, setEditingPost] = useState<EditingPost | null>(null)
  const [expandedPost, setExpandedPost] = useState<number | null>(null)

  const draftPosts = posts.filter((post: Post) => post.isDraft)
  const publishedPosts = posts.filter((post: Post) => !post.isDraft)

  const handleUpdatePost = async (post: EditingPost) => {
    await updatePost.mutateAsync({
      id: post.id,
      data: {
        title: post.title,
        content: post.content,
      },
    })
    setEditingPost(null)
  }

  const handleUpdateDraftStatus = async (postId: number, isDraft: boolean) => {
    try {
      await updateDraftStatus.mutateAsync({ id: postId, isDraft })
    } catch (error) {
      console.error('Failed to update draft status:', error)
    }
  }

  const handleDeletePost = async (postId: number) => {
    try {
      await deletePost.mutateAsync(postId)
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  const toggleExpand = (postId: number) => {
    setExpandedPost(expandedPost === postId ? null : postId)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (!posts.length) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">No Posts Yet</h2>
        <p className="text-gray-600">
          Generate your first post using the form on the left.
        </p>
      </Card>
    )
  }

  const renderPost = (post: Post, isDraft: boolean) => (
    <Card key={post.id} className="p-4">
      {editingPost?.id === post.id ? (
        <div className="space-y-4">
          <Input
            value={editingPost.title}
            onChange={(e) =>
              setEditingPost({ ...editingPost, title: e.target.value })
            }
            className="text-lg font-semibold"
          />
          <Textarea
            value={editingPost.content}
            onChange={(e) =>
              setEditingPost({ ...editingPost, content: e.target.value })
            }
            className="min-h-[200px]"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setEditingPost(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleUpdatePost(editingPost)}
              disabled={updatePost.isPending}
            >
              {updatePost.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <Link
                href={`/post/${post.id}`}
                className="block group cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold truncate group-hover:text-primary">
                    {post.title}
                  </h3>
                  {isDraft && <Badge variant="secondary">Draft</Badge>}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={`text-gray-600 group-hover:text-gray-900 ${expandedPost !== post.id && 'line-clamp-2'}`}>
                  {post.content}
                </div>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => toggleExpand(post.id)}
              >
                {expandedPost === post.id ? (
                  <ChevronUp className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 mr-1" />
                )}
                {expandedPost === post.id ? "Show Less" : "Show More"}
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setEditingPost({
                    id: post.id,
                    title: post.title,
                    content: post.content,
                  })
                }
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit post</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateDraftStatus(post.id, !isDraft)}
                disabled={updateDraftStatus.isPending}
              >
                <FileText className="h-4 w-4" />
                <span className="sr-only">{isDraft ? "Publish post" : "Move to drafts"}</span>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeletePost(post.id)}
                disabled={deletePost.isPending}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete post</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )

  return (
    <div className="space-y-6">
      {draftPosts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Drafts</h2>
          <div className="space-y-3">
            {draftPosts.map((post: Post) => renderPost(post, true))}
          </div>
        </div>
      )}

      {publishedPosts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Published</h2>
          <div className="space-y-3">
            {publishedPosts.map((post: Post) => renderPost(post, false))}
          </div>
        </div>
      )}
    </div>
  )
} 