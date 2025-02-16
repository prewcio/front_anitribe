"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

interface SimilarAnimeProps {
  recommendations: Array<{
    mediaRecommendation: {
      id: number
      title: {
        romaji: string
      }
      coverImage: {
        large: string | null
        medium: string | null
      }
      averageScore: number | null
    }
  }>
}

export default function SimilarAnime({ recommendations }: SimilarAnimeProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth"
      })
    }
  }

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth"
      })
    }
  }

  const formatType = (format: string) => {
    const types: Record<string, string> = {
      TV: "Serial TV",
      MOVIE: "Film",
      OVA: "OVA",
      ONA: "ONA",
      SPECIAL: "Odcinek specjalny",
      TV_SHORT: "Krótki serial",
      UNKNOWN: "Nieznany"
    }
    return types[format] || format
  }

  if (!recommendations || recommendations.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Podobne anime</h2>
      </div>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
        >
          {recommendations.map(({ mediaRecommendation: anime }) => (
            <Link
              key={anime.id}
              href={`/anime/${anime.id}`}
              className="flex-none"
            >
              <Card className="overflow-hidden w-[240px]">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={anime.coverImage?.large || "/placeholder.svg"}
                    alt={anime.title.romaji}
                    fill
                    className="object-cover"
                  />
                  {anime.averageScore && (
                    <div className="absolute top-2 right-2 bg-background/80 px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      {anime.averageScore}%
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-1">
                  <h3 className="font-medium line-clamp-1">
                    {anime.title.romaji}
                  </h3>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 -translate-x-1/2 hidden md:flex"
          onClick={handleScrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 translate-x-1/2 hidden md:flex"
          onClick={handleScrollRight}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

