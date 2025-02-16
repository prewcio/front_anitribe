"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PlayCircle } from "lucide-react"
import { getAnimeEpisodeThumbnails } from "@/lib/api/anilist"

interface Episode {
  title: string
  thumbnail: string
  url: string
  site: string
}

interface WatchingAnime {
  id: number
  title: string
  currentEpisode: number
  totalEpisodes: number
  progress: number
  timeRemaining: number
  episodes?: Episode[]
}

export function ContinueWatching() {
  const [watchingList, setWatchingList] = useState<WatchingAnime[]>([
    {
      id: 1,
      title: "Jujutsu Kaisen Sezon 2",
      currentEpisode: 8,
      totalEpisodes: 24,
      progress: 33,
      timeRemaining: 762 // in seconds
    },
    // Add more mock data as needed
  ])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchEpisodeThumbnails() {
      try {
        const updatedList = await Promise.all(
          watchingList.map(async (anime) => {
            const episodes = await getAnimeEpisodeThumbnails(anime.id)
            return {
              ...anime,
              episodes
            }
          })
        )
        setWatchingList(updatedList)
      } catch (error) {
        console.error("Error fetching episode thumbnails:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEpisodeThumbnails()
  }, [])

  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kontynuuj oglądanie</h2>
        <Link href="/lista/ogladane" className="text-muted-foreground hover:text-foreground transition-colors">
          Zobacz wszystkie
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {watchingList.map((anime) => (
          <Card key={anime.id} className="group relative overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video relative">
                {anime.episodes?.[anime.currentEpisode - 1]?.thumbnail ? (
                  <Image
                    src={anime.episodes[anime.currentEpisode - 1].thumbnail}
                    alt={`Miniatura ${anime.title} odcinek ${anime.currentEpisode}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-accent animate-pulse" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <PlayCircle className="w-12 h-12" />
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold truncate">{anime.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Odcinek {anime.currentEpisode} z {anime.totalEpisodes}
                </p>
                <Progress value={anime.progress} className="h-1" />
                <p className="text-xs text-muted-foreground">
                  Pozostało {formatTimeRemaining(anime.timeRemaining)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

