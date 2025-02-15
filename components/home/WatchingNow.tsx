"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"

interface WatchingAnime {
  id: number
  title: {
    romaji: string
    english: string
    native: string
  }
  coverImage: {
    large: string
  }
  nextAiringEpisode?: {
    episode: number
    timeUntilAiring: number
  }
  progress: {
    current: number
    total: number
  }
}

export function WatchingNow() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Mock data - replace with actual API call
  const watchingAnime: WatchingAnime[] = [
    {
      id: 1,
      title: {
        romaji: "Solo Leveling",
        english: "Solo Leveling",
        native: "나 혼자만 레벨업"
      },
      coverImage: {
        large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/151807-tqHaHqI9EsH1.jpg"
      },
      nextAiringEpisode: {
        episode: 7,
        timeUntilAiring: 432000
      },
      progress: {
        current: 6,
        total: 12
      }
    },
    {
      id: 2,
      title: {
        romaji: "Jujutsu Kaisen 2nd Season",
        english: "Jujutsu Kaisen Season 2",
        native: "呪術廻戦 第2期"
      },
      coverImage: {
        large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/159236-bI8BZYHKoqhX.jpg"
      },
      progress: {
        current: 23,
        total: 23
      }
    }
  ]

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

  const formatTimeUntilAiring = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600))
    const hours = Math.floor((seconds % (24 * 3600)) / 3600)
    
    if (days > 0) {
      return `${days} dni ${hours} godz`
    }
    return `${hours} godz`
  }

  if (watchingAnime.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Aktualnie oglądane</h2>
        <Button variant="ghost" asChild>
          <Link href="/my-list?tab=watching">
            Zobacz więcej
          </Link>
        </Button>
      </div>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
        >
          {watchingAnime.map((anime) => (
            <Link
              key={anime.id}
              href={`/anime/${anime.id}/watch?episode=${anime.progress.current + 1}`}
            >
              <Card className="overflow-hidden w-[300px] flex-none">
                <div className="aspect-video relative">
                  <Image
                    src={anime.coverImage.large}
                    alt={anime.title.english || anime.title.romaji}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="lg" variant="ghost" className="text-white">
                      <Play className="w-12 h-12" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-medium line-clamp-1">
                    {anime.title.english || anime.title.romaji}
                  </h3>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Odcinek {anime.progress.current} z {anime.progress.total}</span>
                    {anime.nextAiringEpisode && (
                      <span>
                        Następny za {formatTimeUntilAiring(anime.nextAiringEpisode.timeUntilAiring)}
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-accent h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all"
                      style={{
                        width: `${(anime.progress.current / anime.progress.total) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        {watchingAnime.length > 2 && (
          <>
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
          </>
        )}
      </div>
    </div>
  )
} 