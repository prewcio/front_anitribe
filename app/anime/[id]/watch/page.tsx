"use client"

import { Suspense, useState, useEffect } from "react"
import { getAnimeDetails } from "@/lib/api/anilist"
import { getEpisodeData, getAnimeComments } from "@/lib/api/laravel"
import { VideoPlayer } from "@/components/VideoPlayer/VideoPlayer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import LoadingSpinner from "@/components/LoadingSpinner"
import Comments from "@/components/Comments"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
  params: {
    id: string
  }
  searchParams: { episode?: string; tab?: string }
}

const ITEMS_PER_PAGE = 20

function WatchPage({ params, searchParams }: Props) {
  const [mounted, setMounted] = useState(false)
  const [anime, setAnime] = useState<any>(null)
  const [episode, setEpisode] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [titleLanguage, setTitleLanguage] = useState<'romaji' | 'english' | 'native'>('romaji')

  const animeId = Number.parseInt(params.id, 10)
  const episodeId = searchParams.episode ? Number.parseInt(searchParams.episode, 10) : 1
  const currentTab = searchParams.tab || "episodes"

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem('titleLanguage') as 'romaji' | 'english' | 'native' || 'romaji'
    setTitleLanguage(savedLanguage)
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const [animeData, episodeData, commentsData] = await Promise.all([
          getAnimeDetails(animeId),
          getEpisodeData(animeId, episodeId),
          getAnimeComments(animeId)
        ])
        setAnime(animeData)
        setEpisode(episodeData)
        setComments(commentsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [animeId, episodeId])

  const getTitle = () => {
    if (!anime) return ""
    if (!mounted) return anime.title.romaji
    return anime.title[titleLanguage] || anime.title.romaji
  }

  if (isLoading || !anime || !episode) {
    return <LoadingSpinner />
  }

  const characters = anime.characters?.edges || []
  const episodes = Array.from({ length: anime.episodes || 0 }, (_, i) => ({
    id: i + 1,
    number: i + 1,
    title: `Odcinek ${i + 1}`,
    thumbnail: "/placeholder.svg"
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4 space-y-6">
          <div className="flex items-center justify-between">
            <Link href={`/anime/${animeId}`} className="text-sm text-muted-foreground hover:text-foreground">
              ← Wróć do strony anime
            </Link>
            <Button variant="outline" asChild>
              <Link href={`/watch-together/create?animeId=${animeId}&episode=${episodeId}`}>
                Oglądaj z innymi
              </Link>
            </Button>
          </div>

          <VideoPlayer
            src={episode.videoUrl}
            poster={episode.thumbnail}
            sections={episode.sections.map((section) => ({
              name: section.type,
              start: section.start,
              end: section.end,
              color: section.type === "OPENING" ? "#ef4444" : "#3b82f6",
            }))}
            animeId={animeId}
            episodeId={episodeId}
          />
          
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold">
                {getTitle()}
              </h1>
              <h2 className="text-xl">
                Odcinek {episode.number}: {episode.title}
              </h2>
            </div>

            {episode.description && (
              <p className="text-muted-foreground">{episode.description}</p>
            )}

            <div className="flex justify-between">
              <Button
                variant="outline"
                disabled={episodeId === 1}
                asChild
              >
                <Link href={`/anime/${animeId}/watch?episode=${episodeId - 1}&tab=${currentTab}`}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Poprzedni odcinek
                </Link>
              </Button>
              <Button
                variant="outline"
                disabled={episodeId === anime.episodes}
                asChild
              >
                <Link href={`/anime/${animeId}/watch?episode=${episodeId + 1}&tab=${currentTab}`}>
                  Następny odcinek
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Komentarze</CardTitle>
              </CardHeader>
              <CardContent>
                <Comments comments={comments} animeId={animeId} />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:w-1/4">
          <Card className="sticky top-20">
            <CardHeader className="p-3">
              <Tabs defaultValue={currentTab} className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="episodes" asChild>
                    <Link href={`/anime/${animeId}/watch?episode=${episodeId}&tab=episodes`}>
                      Odcinki
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger value="characters" asChild>
                    <Link href={`/anime/${animeId}/watch?episode=${episodeId}&tab=characters`}>
                      Postacie
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger value="similar" asChild>
                    <Link href={`/anime/${animeId}/watch?episode=${episodeId}&tab=similar`}>
                      Podobne Anime
                    </Link>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="episodes" className="mt-2">
                  <ScrollArea className="h-[calc(100vh-250px)]">
                    <div className="grid grid-cols-2 gap-2">
                      {episodes.map((ep) => (
                        <Link
                          key={ep.id}
                          href={`/anime/${animeId}/watch?episode=${ep.number}&tab=${currentTab}`}
                          className={`block p-2 rounded-lg transition-colors ${
                            ep.number === episodeId ? 'bg-accent' : 'hover:bg-accent/50'
                          }`}
                        >
                          <div className="relative aspect-video mb-1">
                            <Image
                              src={ep.thumbnail}
                              alt={ep.title}
                              fill
                              className="rounded object-cover"
                            />
                          </div>
                          <p className="text-sm truncate">{ep.title}</p>
                        </Link>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="characters" className="mt-2">
                  <ScrollArea className="h-[calc(100vh-250px)]">
                    <div className="grid grid-cols-2 gap-2">
                      {characters.slice(0, ITEMS_PER_PAGE).map((character) => (
                        <Link
                          key={character.node.id}
                          href={`/character/${character.node.id}`}
                          className="block p-2 rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="relative aspect-[3/4] mb-1">
                            <Image
                              src={character.node.image.large}
                              alt={character.node.name.full}
                              fill
                              className="rounded object-cover"
                            />
                          </div>
                          <p className="text-sm truncate">{character.node.name.full}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {character.role}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="similar" className="mt-2">
                  <ScrollArea className="h-[calc(100vh-250px)]">
                    <div className="grid grid-cols-2 gap-2 p-2">
                      {anime.recommendations?.nodes?.slice(0, ITEMS_PER_PAGE).map((rec: any) => (
                        <Link
                          key={rec.mediaRecommendation.id}
                          href={`/anime/${rec.mediaRecommendation.id}`}
                          className="block p-2 rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="relative aspect-[3/4] mb-1">
                            <Image
                              src={rec.mediaRecommendation.coverImage.large}
                              alt={rec.mediaRecommendation.title.romaji || rec.mediaRecommendation.title.english}
                              fill
                              className="rounded object-cover"
                            />
                          </div>
                          <p className="text-sm truncate">
                            {rec.mediaRecommendation.title.romaji || rec.mediaRecommendation.title.english}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function AnimeWatchPage(props: Props) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <WatchPage {...props} />
    </Suspense>
  )
}

export { generateMetadata } from "./metadata"

