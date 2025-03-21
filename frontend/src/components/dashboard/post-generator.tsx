"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useCreatePost, useGeneratePost } from "@/hooks/use-posts"

const generateSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  style: z.string().min(1, "Style is required"),
})

type GenerateFormValues = z.infer<typeof generateSchema>

export function PostGenerator() {
  const generatePost = useGeneratePost()
  const createPost = useCreatePost()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GenerateFormValues>({
    resolver: zodResolver(generateSchema),
  })

  const onSubmit = async (data: GenerateFormValues) => {
    try {
      const content = await generatePost.mutateAsync(data)
      if (content) {
        await createPost.mutateAsync({
          title: data.topic,
          content,
          isDraft: true,
        })
        reset()
      }
    } catch (error) {
      console.error("Failed to generate post:", error)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Generate New Post</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            placeholder="Enter a topic for your post"
            {...register("topic")}
          />
          {errors.topic && (
            <p className="text-sm text-red-500">{errors.topic.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="style">Writing Style</Label>
          <Input
            id="style"
            placeholder="e.g., Professional, Casual, Technical"
            {...register("style")}
          />
          {errors.style && (
            <p className="text-sm text-red-500">{errors.style.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={generatePost.isPending || createPost.isPending}
        >
          {generatePost.isPending
            ? "Generating..."
            : createPost.isPending
            ? "Saving..."
            : "Generate Post"}
        </Button>
      </form>
    </Card>
  )
} 