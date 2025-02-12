"use client"

import { useState } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { pl } from "date-fns/locale"

interface Comment {
  id: number
  user: {
    username: string
    avatar: string
  }
  content: string
  createdAt: string
}

interface CommentsProps {
  comments: Comment[]
  animeId: number
}

export default function Comments({ comments: initialComments, animeId }: CommentsProps) {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")
  const { isAuthenticated, user } = useAuth()

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const response = await fetch(`/api/anime/${animeId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newComment }),
    })

    if (response.ok) {
      const addedComment = await response.json()
      setComments([addedComment, ...comments])
      setNewComment("")
    }
  }

  return (
    <div className="space-y-6">
      {isAuthenticated && (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Dodaj komentarz..."
            rows={3}
          />
          <Button type="submit">Dodaj komentarz</Button>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-4">
            <Avatar>
              <AvatarImage src={comment.user.avatar} alt={comment.user.username} />
              <AvatarFallback>{comment.user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{comment.user.username}</h4>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: pl })}
                </span>
              </div>
              <p>{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

