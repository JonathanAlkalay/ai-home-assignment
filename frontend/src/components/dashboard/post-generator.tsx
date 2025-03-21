"use client"

import { useState } from "react"
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

const postSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  style: z.string().min(1, "Writing style is required"),
  content: z.string().min(1, "Content is required"),
})

type PostFormValues = z.infer<typeof postSchema>

interface PostGeneratorProps {
  onPostSaved?: () => void;
}

export function PostGenerator({ onPostSaved }: PostGeneratorProps) {
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      topic: "",
      style: "",
      content: "",
    },
  })

  const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = form

  const generatePost = useGeneratePost()
  const createPost = useCreatePost()

  const onGenerate = async (data: PostFormValues) => {
    if (!data.topic || !data.style) {
      toast.error("Please fill in both topic and style")
      return
    }

    try {
      const result = await generatePost.mutateAsync({
        topic: data.topic,
        style: data.style,
      })
      
      if (!result) {
        throw new Error("No content generated")
      }
      
      setValue("content", result)
      toast.success("Content generated successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate content")
    }
  }

  const onSave = async (isDraft: boolean) => {
    const { topic, content } = getValues()

    if (!topic || !content) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      await createPost.mutateAsync({
        title: topic,
        content,
        isDraft,
      })

      toast.success(isDraft ? "Draft saved successfully" : "Post published successfully")
      reset()
      onPostSaved?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save post")
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            placeholder="e.g., The Future of AI in Healthcare"
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
          type="button"
          className="w-full"
          disabled={generatePost.isPending}
          onClick={() => onGenerate(getValues())}
        >
          {generatePost.isPending ? "Generating..." : "Generate Content"}
        </Button>

        {form.watch("content") && (
          <Card className="p-4">
            <div className="space-y-4">
              <Textarea
                {...register("content")}
                className="min-h-[200px] resize-none"
                readOnly
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onSave(true)}
                  disabled={createPost.isPending}
                >
                  {createPost.isPending ? "Saving..." : "Save as Draft"}
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={() => onSave(false)}
                  disabled={createPost.isPending}
                >
                  {createPost.isPending ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
} 