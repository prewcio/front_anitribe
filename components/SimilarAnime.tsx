"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface AnimeRecommendation {
  id: number
  title: {
    romaji: string
    english: string
  }
  coverImage: {
    large: string
  }
}

interface SimilarAnimeProps {
  recommendations: AnimeRecommendation[]
}

export default function SimilarAnime({ recommendations }: SimilarAnimeProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
    }
  }

  if (!recommendations.length) return null

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-4">Podobne Anime</h2>
      <div className="relative group">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide gap-3 py-2"
        >
          {recommendations.map((anime) => (
            <Link
              key={anime.id}
              href={`/anime/${anime.id}`}
              className="flex-shrink-0 w-[160px]"
            >
              <Card className="overflow-hidden h-full">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={anime.coverImage.large}
                    alt={anime.title.english || anime.title.romaji}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-sm line-clamp-2">
                    {anime.title.english || anime.title.romaji}
                  </h3>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

