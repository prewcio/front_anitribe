import { Suspense } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { VideoPlayer } from "@/components/VideoPlayer/VideoPlayer"
import { getAnimeDetails } from "@/lib/api/anilist"
import { getEpisodeData, getAvailablePlayers } from "@/lib/api/laravel"
import LoadingSpinner from "@/components/LoadingSpinner"
import ErrorMessage from "@/components/ErrorMessage"
import { translateToPolish } from "@/lib/utils/translate"
import { PlayerSelector } from "@/components/PlayerSelector"
import { AnimeInfoTabs } from "@/components/AnimeInfoTabs"

interface Props {
  params: { id: string; episodeId: string }
}

async function WatchPageContent({ params }: Props) {
  const animeId = Number.parseInt(params.id, 10)
  const episodeId = Number.parseInt(params.episodeId, 10)

  try {
    const [anime, episode, availablePlayers] = await Promise.all([
      getAnimeDetails(animeId),
      getEpisodeData(animeId, episodeId),
      getAvailablePlayers(animeId, episodeId),
    ])

    if (!episode) {
      notFound()
    }

    const previousEpisode = episodeId > 1 ? episodeId - 1 : null
    const nextEpisode = episodeId < (anime.episodes || 0) ? episodeId + 1 : null

    const videoSections = episode.sections.map((section) => ({
      name: section.type,
      start: section.start,
      end: section.end,
      color: section.type === "OPENING" ? "#ef4444" : "#3b82f6",
    }))

    const translatedDescription = await translateToPolish(episode.description)

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 xl:w-3/4">
            <VideoPlayer
              src={episode.videoUrl}
              poster={episode.thumbnail}
              sections={videoSections}
              animeId={animeId}
              episodeId={episodeId}
            />
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  {anime.title.english || anime.title.romaji} - Odcinek {episode.number}
                </h1>
                <h2 className="text-lg sm:text-xl text-muted-foreground">{episode.title}</h2>
              </div>
              <PlayerSelector players={availablePlayers} />
            </div>
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap gap-2 sm:gap-4">
                {previousEpisode && (
                  <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                    <Link href={`/anime/${animeId}/watch/${previousEpisode}`}>← Poprzedni odcinek</Link>
                  </Button>
                )}
                {nextEpisode && (
                  <Button asChild size="sm" className="w-full sm:w-auto">
                    <Link href={`/anime/${animeId}/watch/${nextEpisode}`}>Następny odcinek →</Link>
                  </Button>
                )}
                <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                  <Link href={`/anime/${animeId}`}>Powrót do strony anime</Link>
                </Button>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Opis odcinka</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{translatedDescription}</p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/3 xl:w-1/4 mt-8 lg:mt-0">
            <AnimeInfoTabs
              characters={anime.characters?.edges || []}
              recommendations={anime.recommendations?.nodes?.map((node: any) => node.mediaRecommendation) || []}
            />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching episode data:", error)
    return <ErrorMessage message="Nie udało się załadować danych odcinka. Spróbuj ponownie później." />
  }
}

export default function WatchPage({ params }: Props) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <WatchPageContent params={params} />
    </Suspense>
  )
}

