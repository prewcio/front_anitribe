"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { getPopularAnime } from "@/lib/api/hybrid"

interface PopularAnime {
  id: number
  title: {
    romaji: string
    english: string
    native: string
  }
  coverImage: {
    large: string
  }
  averageScore: number
  format: string
  episodes: number
}

export function PopularNow() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [popularAnime, setPopularAnime] = useState<PopularAnime[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPopularAnime()
        setPopularAnime(data)
      } catch (error) {
        console.error("Error fetching popular anime:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

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
      TV_SHORT: "Krótki serial"
    }
    return types[format] || format
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Popularne teraz</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="w-full">
              <div className="aspect-[2/3] bg-accent animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-accent animate-pulse rounded" />
                <div className="h-4 w-2/3 bg-accent animate-pulse rounded" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Popularne teraz</h2>
        <Button variant="ghost" asChild>
          <Link href="/browse?sort=POPULARITY_DESC">
            Zobacz więcej
          </Link>
        </Button>
      </div>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
        >
          {popularAnime.map((anime) => (
            <Link
              key={anime.id}
              href={`/anime/${anime.id}`}
              className="flex-none"
            >
              <Card className="overflow-hidden w-[240px]">
                <div className="aspect-[2/3] relative">
                  <Image
                    src={anime.coverImage.large}
                    alt={anime.title.english || anime.title.romaji}
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
                    {anime.title.english || anime.title.romaji}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatType(anime.format)}
                    {anime.episodes ? ` • ${anime.episodes} odcinków` : ''}
                  </p>
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