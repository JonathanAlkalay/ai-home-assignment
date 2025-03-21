"use client"

import { PostGenerator } from "@/components/dashboard/post-generator"
import SavedPosts from "@/components/dashboard/saved-posts"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
          <PostGenerator />
        </div>
        <div className="lg:overflow-y-auto lg:h-[calc(100vh-4rem)]">
          <SavedPosts />
        </div>
      </div>
    </div>
  )
} 