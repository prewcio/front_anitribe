"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface AnimeData {
  id: number
  title: {
    romaji: string
    english: string | null
  }
  coverImage: {
    medium: string
  }
}

interface SimilarAnimeProps {
  recommendations: AnimeData[]
}

export default function SimilarAnime({ recommendations }: SimilarAnimeProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      setScrollPosition(scrollContainerRef.current.scrollLeft + scrollAmount)
    }
  }

  const handleAnimeClick = (id: number) => {
    router.push(`/anime/${id}`)
  }

  return (
    <div className="relative">
      <h3 className="text-xl font-semibold mb-4">Podobne anime</h3>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 z-10"
          onClick={() => scroll("left")}
          disabled={scrollPosition <= 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {recommendations.map((anime) => (
            <Card
              key={anime.id}
              className="w-32 flex-shrink-0 overflow-hidden bg-card hover:bg-accent transition-colors cursor-pointer"
              onClick={() => handleAnimeClick(anime.id)}
            >
              <div className="aspect-[3/4] relative">
                <img
                  src={anime.coverImage.medium || "/placeholder.svg"}
                  alt={anime.title.english || anime.title.romaji}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2">
                <p className="font-medium text-xs line-clamp-2">{anime.title.english || anime.title.romaji}</p>
              </div>
            </Card>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 z-10"
          onClick={() => scroll("right")}
          disabled={
            scrollContainerRef.current &&
            scrollPosition >= scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth
          }
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

