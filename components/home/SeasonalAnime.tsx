"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { getSeasonalAnimeWithMalIds } from "@/lib/api/anilist"

interface SeasonalAnime {
  id: number
  title: {
    romaji: string
    english: string | null
    native: string | null
  }
  coverImage: {
    large: string
  }
  averageScore: number
  format: string
  episodes: number | null
  nextAiringEpisode?: {
    episode: number
    timeUntilAiring: number
  }
}

interface SeasonData {
  media: SeasonalAnime[]
  season: string
  year: number
}

export function SeasonalAnime() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [seasonData, setSeasonData] = useState<SeasonData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getSeasonalAnimeWithMalIds()
        setSeasonData(data)
        setError(null)
      } catch (error) {
        console.error("Error fetching seasonal anime:", error)
        setError("Failed to load seasonal anime")
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

  const formatTimeUntilAiring = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600))
    const hours = Math.floor((seconds % (24 * 3600)) / 3600)
    
    if (days > 0) {
      return `${days} dni ${hours} godz`
    }
    return `${hours} godz`
  }

  const formatSeason = (season: string) => {
    const seasons: Record<string, string> = {
      WINTER: "Zima",
      SPRING: "Wiosna",
      SUMMER: "Lato",
      FALL: "Jesień"
    }
    return seasons[season] || season
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Ładowanie...</h2>
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

  if (error || !seasonData || !seasonData.media) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-destructive">
            {error || "Failed to load seasonal anime"}
          </h2>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Sezon {formatSeason(seasonData.season)} {seasonData.year}
        </h2>
        <Button variant="ghost" asChild>
          <Link href={`/browse?season=${seasonData.season}&year=${seasonData.year}&sort=POPULARITY_DESC`}>
            Zobacz więcej
          </Link>
        </Button>
      </div>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
        >
          {seasonData.media.map((anime) => (
            <Link
              key={anime.id}
              href={`/anime/${anime.id}`}
              className="flex-none"
            >
              <Card className="overflow-hidden w-[240px] group hover:ring-2 hover:ring-purple-500 transition-all duration-200">
                <div className="aspect-[2/3] relative">
                  {anime.coverImage.large && (
                    <Image
                      src={anime.coverImage.large}
                      alt={anime.title.english || anime.title.romaji}
                      fill
                      className="object-cover"
                    />
                  )}
                  {anime.nextAiringEpisode && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent pb-3 pt-8">
                      <div className="flex flex-col px-3">
                        <div className="bg-background/80 rounded-lg p-2 shadow-lg backdrop-blur-sm border border-purple-500/20">
                          <span className="text-sm font-bold text-purple-400 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] block">
                            Następny odcinek
                          </span>
                          <span className="text-sm font-medium text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                            EP {anime.nextAiringEpisode.episode} za {formatTimeUntilAiring(anime.nextAiringEpisode.timeUntilAiring)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {anime.averageScore && (
                    <div className="absolute top-2 right-2 bg-background/80 px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg backdrop-blur-sm">
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
                    {anime.episodes && ` • ${anime.episodes} odcinków`}
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


