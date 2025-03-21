"use client"

import { PostGenerator } from "@/components/dashboard/post-generator"
import SavedPosts from "@/components/dashboard/saved-posts"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <PostGenerator />
      <SavedPosts />
    </div>
  )
} 