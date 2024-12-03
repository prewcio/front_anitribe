import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { getAnimeDetails } from "@/lib/api/anilist"
import { getAnimeComments, rateAnime } from "@/lib/api/laravel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import LoadingSpinner from "@/components/LoadingSpinner"
import { AnimeRating } from "@/components/AnimeRating"
import Comments from "@/components/Comments"
import { InteractiveTag } from "@/components/InteractiveTag"
import { StudioButton } from "@/components/StudioButton"
import { NextEpisodeBox } from "./NextEpisodeBox"
import Characters from "@/components/Characters"
import SimilarAnime from "@/components/SimilarAnime"
import { formatDescription } from "@/lib/utils/formatDescription"
import { VideoPlayer } from "@/components/VideoPlayer/VideoPlayer"
import { redirect } from "next/navigation"
import { getEpisodeData } from "@/lib/api/laravel" // Import getEpisodeData

interface Props {
  params: { id: string }
  searchParams: { watch?: string }
}

async function AnimeDetails({ params, searchParams }: Props) {
  const id = Number.parseInt(params.id, 10)
  const watchEpisodeId = searchParams.watch ? Number.parseInt(searchParams.watch, 10) : null

  // If watch parameter is present, redirect to the watch page
  if (watchEpisodeId) {
    redirect(`/anime/${id}/watch?episode=${watchEpisodeId}`)
  }

  const [anime, userProgress, comments] = await Promise.all([
    getAnimeDetails(id),
    Promise.resolve({
      currentEpisode: 5,
      totalEpisodes: 12,
      status: "Watching",
      rating: 4,
    }),
    getAnimeComments(id),
  ])

  let watchEpisode = null
  if (watchEpisodeId) {
    watchEpisode = await getEpisodeData(id, watchEpisodeId)
  }

  const formatDate = (date: { year: number; month: number; day: number }) => {
    return new Date(date.year, date.month - 1, date.day).toLocaleDateString("pl-PL")
  }

  return (
    <div className="space-y-6">
      <div className="relative w-full h-64 md:h-96">
        <Image
          src={anime.bannerImage || anime.coverImage.large}
          alt={anime.title.english || anime.title.romaji || anime.title.native}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6 -mt-32 relative z-10">
          <div className="md:w-1/3">
            <Image
              src={anime.coverImage.large || "/placeholder.svg"}
              alt={anime.title.english || anime.title.romaji || anime.title.native}
              width={300}
              height={450}
              className="rounded-lg shadow-lg"
            />
            {anime.status === "RELEASING" && anime.nextAiringEpisode && (
              <div className="mt-4 flex justify-center">
                <NextEpisodeBox
                  episode={anime.nextAiringEpisode.episode}
                  timeUntilAiring={anime.nextAiringEpisode.timeUntilAiring}
                />
              </div>
            )}
            <div className="mt-4 space-y-4">
              <AnimeRating
                initialRating={userProgress?.rating || 0}
                animeId={id}
              />
              {userProgress && (
                <Card>
                  <CardHeader>
                    <CardTitle>Twój postęp</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress
                      value={(userProgress.currentEpisode / userProgress.totalEpisodes) * 100}
                      className="mb-2"
                    />
                    <p className="text-sm text-muted-foreground">
                      Odcinek {userProgress.currentEpisode} z {userProgress.totalEpisodes}
                    </p>
                    <p className="text-sm text-muted-foreground">Status: {userProgress.status}</p>
                  </CardContent>
                </Card>
              )}
              <div className="flex gap-4">
                <Button asChild className="flex-1">
                  <Link href={`/anime/${id}?watch=${userProgress ? userProgress.currentEpisode + 1 : 1}`}>
                    {userProgress ? "Kontynuuj" : "Rozpocznij oglądanie"}
                  </Link>
                </Button>
                {userProgress && (
                  <Button variant="outline" className="flex-1">
                    Edytuj postęp
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="md:w-2/3 space-y-6">
            {watchEpisode && (
              <div className="space-y-4">
                <VideoPlayer
                  src={watchEpisode.videoUrl}
                  poster={watchEpisode.thumbnail}
                  sections={watchEpisode.sections.map((section) => ({
                    name: section.type,
                    start: section.start,
                    end: section.end,
                    color: section.type === "OPENING" ? "#ef4444" : "#3b82f6",
                  }))}
                  animeId={id}
                  episodeId={watchEpisodeId}
                />
                <h2 className="text-2xl font-bold">
                  Odcinek {watchEpisode.number}: {watchEpisode.title}
                </h2>
                <p>{watchEpisode.description}</p>
                <div className="flex justify-between">
                  <Button variant="outline" disabled={watchEpisodeId === 1} asChild>
                    <Link href={`/anime/${id}?watch=${watchEpisodeId - 1}`}>Poprzedni odcinek</Link>
                  </Button>
                  <Button variant="outline" disabled={watchEpisodeId === anime.episodes} asChild>
                    <Link href={`/anime/${id}?watch=${watchEpisodeId + 1}`}>Następny odcinek</Link>
                  </Button>
                </div>
              </div>
            )}
            {watchEpisode === null && (
              <>
                <div>
                  <h1 className="text-3xl font-bold">{anime.title.english || anime.title.romaji}</h1>
                  <p className="text-lg text-muted-foreground">{anime.title.native}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre) => (
                    <InteractiveTag key={genre} tag={genre} />
                  ))}
                  {anime.tags &&
                    anime.tags.map((tag: { name: string }) => <InteractiveTag key={tag.name} tag={tag.name} />)}
                </div>
                <article
                  className="prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg prose-a:text-primary hover:prose-a:opacity-80 max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: formatDescription(anime.description),
                  }}
                />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold">Format:</p>
                    <p>{anime.format}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Odcinki:</p>
                    <p>{anime.episodes || "Nieznane"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Status:</p>
                    <p>{anime.status}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Czas trwania:</p>
                    <p>{anime.duration} min</p>
                  </div>
                  <div>
                    <p className="font-semibold">Data rozpoczęcia:</p>
                    <p>{formatDate(anime.startDate)}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Data zakończenia:</p>
                    <p>{anime.endDate.year ? formatDate(anime.endDate) : "W trakcie emisji"}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Studia</h3>
                  <div className="flex flex-wrap gap-2">
                    {anime.studios.nodes.map((studio: { name: string }) => (
                      <StudioButton key={studio.name} studio={studio.name} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-8 space-y-8">
          <Characters characters={anime.characters?.edges || []} />
          <SimilarAnime
            recommendations={anime.recommendations?.nodes?.map((node: any) => node.mediaRecommendation) || []}
          />
        </div>
        <div className="mt-8">
          <Comments comments={comments} animeId={id} />
        </div>
      </div>
    </div>
  )
}

export default function AnimePage({ params, searchParams }: Props) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AnimeDetails params={params} searchParams={searchParams} />
    </Suspense>
  )
}

