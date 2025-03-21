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
  FileText,
  Share2,
} from 'lucide-react'

interface EditingPost {
  id: number
  title: string
  content: string
}

export default function SavedPosts() {
  const { data: posts = [], isLoading } = usePosts()
  const updatePost = useUpdatePost()
  const updateDraftStatus = useUpdateDraftStatus()
  const deletePost = useDeletePost()
  const [editingPost, setEditingPost] = useState<EditingPost | null>(null)

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

  const handleUpdateDraftStatus = async (id: number, isDraft: boolean) => {
    await updateDraftStatus.mutateAsync({ id, isDraft })
  }

  const handleDeletePost = async (id: number) => {
    await deletePost.mutateAsync(id)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="p-4">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {draftPosts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Drafts</h2>
          <div className="space-y-4">
            {draftPosts.map((post: Post) => (
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
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          <Badge variant="secondary">Draft</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
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
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateDraftStatus(post.id, false)}
                          disabled={updateDraftStatus.isPending}
                        >
                          {updateDraftStatus.isPending ? "Publishing..." : "Publish"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                          disabled={deletePost.isPending}
                        >
                          {deletePost.isPending ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {publishedPosts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Published</h2>
          <div className="space-y-4">
            {publishedPosts.map((post: Post) => (
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
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
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
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateDraftStatus(post.id, true)}
                          disabled={updateDraftStatus.isPending}
                        >
                          {updateDraftStatus.isPending
                            ? "Moving to Draft..."
                            : "Move to Draft"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                          disabled={deletePost.isPending}
                        >
                          {deletePost.isPending ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 