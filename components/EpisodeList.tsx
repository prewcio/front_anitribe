"use client"

import Link from "next/link"
import { format, isFuture } from "date-fns"
import { pl } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import type { Episode } from "@/types/anime"

interface EpisodeListProps {
  episodes: Episode[]
  animeId: number
  userProgress?: { currentEpisode: number } | null
  className?: string
  layout?: "horizontal" | "vertical"
}

export default function EpisodeList({
  episodes,
  animeId,
  userProgress,
  className,
  layout = "vertical",
}: EpisodeListProps) {
  const getLanguageFlags = (languages: { dubbing: string[]; subtitles: string[] }) => {
    const flags: Record<string, string> = {
      JP: "🇯🇵",
      EN: "🇬🇧",
      PL: "🇵🇱",
    }

    return (
      <div className="flex gap-1 items-center">
        {languages.dubbing.length > 0 && (
          <span className="text-xs text-muted-foreground">
            Dubbing: {languages.dubbing.map((lang) => flags[lang]).join(" ")}
          </span>
        )}
        {languages.subtitles.length > 0 && (
          <span className="text-xs text-muted-foreground">
            Napisy: {languages.subtitles.map((lang) => flags[lang]).join(" ")}
          </span>
        )}
      </div>
    )
  }

  const getReleaseInfo = (releaseDate: string | undefined) => {
    if (!releaseDate) return null

    const date = new Date(releaseDate)
    if (isFuture(date)) {
      return (
        <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded">
          {format(date, "d 'dni'", { locale: pl })}
        </span>
      )
    }
    return null
  }

  return (
    <div className={className}>
      <div className="space-y-2">
        {episodes.map((episode) => {
          const isFutureEpisode = episode.releaseDate && isFuture(new Date(episode.releaseDate))
          const isWatched = userProgress && userProgress.currentEpisode >= episode.number

          return (
            <div
              key={episode.id}
              className={`flex items-center justify-between p-3 rounded bg-card hover:bg-accent transition-colors ${
                layout === "horizontal" ? "min-w-[250px]" : "w-full"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center rounded bg-primary/10 text-primary">
                  {episode.number}
                </div>
                <div>
                  <h3 className="font-medium">{episode.title}</h3>
                  {getLanguageFlags(episode.languages)}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {getReleaseInfo(episode.releaseDate)}
                {!isFutureEpisode && (
                  <Button asChild variant={isWatched ? "secondary" : "default"} size="sm">
                    <Link href={`/anime/${animeId}/watch?episode=${episode.number}`}>
                      {isWatched ? "Obejrzano" : "Oglądaj"}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

