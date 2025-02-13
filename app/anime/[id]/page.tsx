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
import { redirect } from "next/navigation"
import { getEpisodeData } from "@/lib/api/laravel" // Import getEpisodeData
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Play, Plus, Star, Pencil, ChevronLeft, ChevronRight } from "lucide-react"
import RelatedAnimeSection from "@/components/RelatedAnimeSection"

interface RelatedAnime {
  id: number
  title: string
  coverImage: string
  format: string
  status: string
  relationType: string
}

interface AnimeRatingProps {
  initialRating: number
  animeId: number
}

interface AnimeRelation {
  id: number
  relationType: string
  node: {
    id: number
    title: {
      userPreferred: string
    }
    coverImage: {
      large: string
    }
    format: string
    status: string
  }
}

interface Props {
  params: { id: string }
  searchParams: { 
    watch?: string
    tab?: string 
  }
}

// Add translation mappings
const STATUS_TRANSLATIONS: Record<string, string> = {
  FINISHED: "Zakończone",
  RELEASING: "W trakcie emisji",
  NOT_YET_RELEASED: "Niewyemitowane",
  CANCELLED: "Anulowane",
  HIATUS: "Wstrzymane"
}

const FORMAT_TRANSLATIONS: Record<string, string> = {
  TV: "Serial TV",
  MOVIE: "Film",
  OVA: "OVA",
  ONA: "ONA",
  SPECIAL: "Odcinek specjalny",
  MUSIC: "Teledysk",
  TV_SHORT: "Krótki serial TV"
}

const TYPE_TRANSLATIONS: Record<string, string> = {
  ANIME: "Anime",
  MANGA: "Manga",
  LIGHT_NOVEL: "Light Novel",
  VISUAL_NOVEL: "Visual Novel",
  ONE_SHOT: "One Shot",
  NOVEL: "Powieść"
}

// Add season translations
const SEASON_TRANSLATIONS: Record<string, string> = {
  FALL: "JESIEŃ",
  SPRING: "WIOSNA",
  WINTER: "ZIMA",
  SUMMER: "LATO"
}

const STATUS_TRANSLATIONS_PROGRESS: Record<string, string> = {
  Watching: "Oglądam",
  Completed: "Ukończone",
  Planned: "Zaplanowane",
  Dropped: "Porzucone",
  OnHold: "Wstrzymane"
}

async function AnimeDetails({ params, searchParams }: Props) {
  const id = Number.parseInt(params.id, 10)
  const watchEpisodeId = searchParams.watch ? Number.parseInt(searchParams.watch as string, 10) : null

  // First fetch anime details
  const anime = await getAnimeDetails(id)

  // Then fetch the rest in parallel
  const [userProgress, comments, formattedDescription] = await Promise.all([
    Promise.resolve({
      currentEpisode: 5,
      totalEpisodes: 12,
      status: "Watching",
      rating: 4,
    }),
    getAnimeComments(id),
    formatDescription(anime.description),
  ])

  const relatedAnime = anime.relations?.edges?.filter((edge: AnimeRelation) => 
    edge.node.format && ["TV", "MOVIE", "OVA", "ONA", "SPECIAL", "TV_SHORT"].includes(edge.node.format)
  ) || []

  let watchEpisode = null
  if (watchEpisodeId !== null) {
    watchEpisode = await getEpisodeData(id, watchEpisodeId)
  }

  const formatDate = (date: { year: number; month: number; day: number }) => {
    if (!date.year || !date.month || !date.day) return "Nieznane"
    try {
      return new Date(date.year, date.month - 1, date.day).toLocaleDateString("pl-PL", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    } catch (error) {
      return "Nieznane"
    }
  }

  const getRelationLabel = (type: string) => {
    const labels: Record<string, string> = {
      PREQUEL: "Poprzednia Seria",
      SEQUEL: "Następna Seria",
      SPIN_OFF: "Spin-off",
      SIDE_STORY: "Historia Poboczna",
      PARENT: "Seria Główna",
      ADAPTATION: "Adaptacja",
      ALTERNATIVE: "Alternatywna Historia",
      CHARACTER: "Historia Postaci",
      SUMMARY: "Podsumowanie",
      OTHER: "Powiązane"
    }
    return labels[type] || type
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
              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link href={`/anime/${id}/watch?episode=${userProgress ? userProgress.currentEpisode + 1 : 1}`}>
                    <Play className="w-4 h-4 mr-2" />
                    {userProgress ? "Kontynuuj" : "Rozpocznij oglądanie"}
                  </Link>
                </Button>
                <Button variant="outline" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <AnimeRating 
                initialRating={0} 
                animeId={anime.id} 
              />
              
              {userProgress && (
                <div className="w-full bg-[#1e1b2c] rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-purple-400 font-medium">
                        Twój postęp
                      </span>
                      <span className="text-lg font-bold text-white mt-0.5">
                        {userProgress.currentEpisode} z {userProgress.totalEpisodes}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-purple-400 font-medium">
                          Status
                        </span>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-purple-400 hover:text-purple-300">
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="text-sm text-white mt-0.5">
                        {STATUS_TRANSLATIONS_PROGRESS[userProgress.status] || userProgress.status}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-purple-500/10 h-1.5">
                    <div 
                      className="h-full bg-purple-500 transition-all duration-300"
                      style={{ width: `${(userProgress.currentEpisode / userProgress.totalEpisodes) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              <Button variant="outline" className="w-full">
                <Star className="w-4 h-4 mr-2" />
                Dodaj do ulubionych
              </Button>
            </div>
          </div>
          <div className="md:w-2/3 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold">{anime.title.english || anime.title.romaji}</h1>
                  <p className="text-lg text-muted-foreground">{anime.title.native}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {anime.genres?.map((genre: string) => (
                    <InteractiveTag key={genre} tag={genre} />
                  ))}
                  {anime.tags?.map((tag: { name: string; description: string }) => (
                    <InteractiveTag 
                      key={tag.name} 
                      tag={tag.name}
                      description={tag.description}
                    />
                  ))}
                </div>
                <article
                  className="prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg prose-a:text-primary hover:prose-a:opacity-80 max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: formattedDescription,
                  }}
                />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold">Format:</p>
                    <p>{FORMAT_TRANSLATIONS[anime.format] || anime.format}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Odcinki:</p>
                    <p>{anime.episodes || "Nieznane"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Status:</p>
                    <p>{STATUS_TRANSLATIONS[anime.status] || anime.status}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Czas trwania:</p>
                    <p>{anime.duration ? `${anime.duration} min` : "? min"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Data rozpoczęcia:</p>
                    <p>{formatDate(anime.startDate)}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Data zakończenia:</p>
                    <p>{anime.endDate.year ? formatDate(anime.endDate) : "W trakcie emisji"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Sezon:</p>
                    <p>{anime.season ? `${SEASON_TRANSLATIONS[anime.season]} ${anime.seasonYear}` : "Nieznane"}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Studia</h3>
                  <div className="flex flex-wrap gap-2">
                    {anime.studios.nodes.map((studio: { name: string, id: number }) => (
                      <StudioButton key={studio.name} studio={studio.name} id={studio.id} />
                    ))}
                  </div>
                </div>
          </div>
        </div>
        <div className="mt-8 space-y-8">
          {/* Related Anime Section */}
          {relatedAnime.length > 0 && (
            <RelatedAnimeSection relatedAnime={relatedAnime} />
          )}
          
          {anime.characters?.edges?.length > 0 && (
            <Characters characters={anime.characters.edges} />
          )}

          {anime.recommendations?.nodes?.length > 0 && (
            <SimilarAnime
              recommendations={anime.recommendations.nodes.map((node: any) => node.mediaRecommendation)}
            />
          )}
        </div>
        <div className="mt-8">
          <Comments comments={comments} animeId={id} />
        </div>
      </div>
    </div>
  )
}

export default async function AnimePage({ params, searchParams }: Props) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AnimeDetails params={params} searchParams={searchParams} />
    </Suspense>
  )
}

