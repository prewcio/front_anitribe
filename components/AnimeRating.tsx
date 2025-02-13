"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface AnimeRatingProps {
  initialRating: number
  animeId: number
}

export function AnimeRating({ initialRating, animeId }: AnimeRatingProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleRate = async (newRating: number) => {
    setRating(newRating)
    try {
      const response = await fetch(`/api/anime/${animeId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: newRating }),
      })
      if (!response.ok) {
        throw new Error("Failed to rate anime")
      }
    } catch (error) {
      console.error("Error rating anime:", error)
      setRating(rating) // Revert on error
    }
  }

  return (
    <div className="flex items-center justify-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <Button
          key={value}
          variant="ghost"
          size="icon"
          className="w-8 h-8"
          onMouseEnter={() => setHoveredRating(value)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => handleRate(value)}
        >
          <Star
            className={`w-5 h-5 ${
              value <= (hoveredRating || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        </Button>
      ))}
    </div>
  )
}

