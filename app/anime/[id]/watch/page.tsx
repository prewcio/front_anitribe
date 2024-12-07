import { Suspense } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { VideoPlayer } from "@/components/VideoPlayer/VideoPlayer"
import { getAnimeDetails } from "@/lib/api/anilist"
import { getEpisodeData, getAvailablePlayers, getAnimeEpisodes, getAnimeComments } from "@/lib/api/laravel"
import LoadingSpinner from "@/components/LoadingSpinner"
import ErrorMessage from "@/components/ErrorMessage"
import { PlayerSelector } from "@/components/PlayerSelector"
import { CollapsibleSideMenu } from "@/components/CollapsibleSideMenu"
import Comments from "@/components/Comments"

interface Props {
  params: { id: string }
  searchParams: { episode: string }
}

async function WatchPageContent({ params, searchParams }: Props) {
  const animeId = Number.parseInt(params.id, 10)
  const episodeId = Number.parseInt(searchParams.episode, 10)

  if (!episodeId) {
    notFound()
  }

  try {
    const [anime, episode, availablePlayers, episodes, comments] = await Promise.all([
      getAnimeDetails(animeId),
      getEpisodeData(animeId, episodeId),
      getAvailablePlayers(animeId, episodeId),
      getAnimeEpisodes(animeId).then((episodes) =>
        episodes.map((episode) => ({
          ...episode,
          languages: {
            dubbing: episode.languages.dubbing,
            subtitles: episode.languages.subtitles,
          },
        })),
      ),
      getAnimeComments(animeId),
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

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-grow">
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
                    <Link href={`/anime/${animeId}/watch?episode=${previousEpisode}`}>← Poprzedni odcinek</Link>
                  </Button>
                )}
                {nextEpisode && (
                  <Button asChild size="sm" className="w-full sm:w-auto">
                    <Link href={`/anime/${animeId}/watch?episode=${nextEpisode}`}>Następny odcinek →</Link>
                  </Button>
                )}
                <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                  <Link href={`/anime/${animeId}`}>Powrót do strony anime</Link>
                </Button>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Opis odcinka</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{episode.description}</p>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Komentarze</h3>
                <Comments comments={comments} animeId={animeId} />
              </div>
            </div>
          </div>
          <CollapsibleSideMenu
            characters={anime.characters?.edges || []}
            recommendations={anime.recommendations?.nodes?.map((node: any) => node.mediaRecommendation) || []}
            episodes={episodes}
            animeId={animeId}
            currentEpisode={episodeId}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching episode data:", error)
    return <ErrorMessage message="Nie udało się załadować danych odcinka. Spróbuj ponownie później." />
  }
}

export default function WatchPage({ params, searchParams }: Props) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <WatchPageContent params={params} searchParams={searchParams} />
    </Suspense>
  )
}

