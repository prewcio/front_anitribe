"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { getUpcomingAnimeWithMalIds } from "@/lib/api/anilist"

interface UpcomingAnime {
  id: number
  title: {
    romaji: string
    english: string | null
    native: string | null
  }
  coverImage: {
    large: string
  }
  startDate: {
    year: number
    month: number
    day: number | null
  }
  format: string
  episodes: number | null
  genres: string[]
}

export function UpcomingAnime() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [upcomingAnime, setUpcomingAnime] = useState<UpcomingAnime[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUpcomingAnimeWithMalIds()
        setUpcomingAnime(data)
      } catch (error) {
        console.error("Error fetching upcoming anime:", error)
        setError("Failed to load upcoming anime")
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

  const formatDate = (date: { year: number | null; month: number | null; day: number | null }) => {
    if (!date.year) return "Data nieznana"
    if (!date.month) return date.year.toString()
    
    const months = [
      "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
      "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
    ]
    
    if (!date.day) return `${months[date.month - 1]} ${date.year}`
    return `${date.day} ${months[date.month - 1]} ${date.year}`
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Nadchodzące premiery</h2>
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
        <h2 className="text-2xl font-bold">Nadchodzące premiery</h2>
        <Button variant="ghost" asChild>
          <Link href="/browse?status=NOT_YET_RELEASED&sort=START_DATE_DESC">
            Zobacz więcej
          </Link>
        </Button>
      </div>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
        >
          {upcomingAnime.map((anime) => (
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
                  <div className="absolute top-2 right-2 bg-background/80 px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(anime.startDate)}
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <h3 className="font-medium line-clamp-1">
                    {anime.title.english || anime.title.romaji}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatType(anime.format)}
                    {anime.episodes && ` • ${anime.episodes} odcinków`}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {anime.genres.slice(0, 3).map((genre) => (
                      <span
                        key={genre}
                        className="text-xs bg-muted px-2 py-0.5 rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
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