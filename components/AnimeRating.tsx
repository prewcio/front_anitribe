"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AnimeRatingProps {
  initialRating?: number
  onRate: (rating: number) => Promise<void>
}

export function AnimeRating({ initialRating = 0, onRate }: AnimeRatingProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRate = async (newRating: number) => {
    setIsSubmitting(true)
    try {
      await onRate(newRating)
      setRating(newRating)
    } catch (error) {
      console.error("Failed to submit rating:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          variant="ghost"
          size="sm"
          disabled={isSubmitting}
          onClick={() => handleRate(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          <Star
            className={`h-6 w-6 ${
              (hoveredRating || rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        </Button>
      ))}
      <span className="text-sm font-medium">{rating > 0 ? `Twoja ocena: ${rating}/5` : "Oceń anime"}</span>
    </div>
  )
}

