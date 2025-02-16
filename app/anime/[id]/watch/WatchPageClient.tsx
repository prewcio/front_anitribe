"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { VideoPlayer } from "@/components/VideoPlayer/VideoPlayer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Comments from "@/components/Comments"
import { ChevronLeft, ChevronRight, Play, Loader2 } from "lucide-react"
import { translateWithCache } from "@/lib/utils/translate"
import { getSlugFromTitle, getEpisodePlayers, type DocchiPlayer } from "@/lib/utils/docchi"
import { JP, PL } from "@/components/icons/flags"

const ITEMS_PER_PAGE = 20

interface WatchPageClientProps {
  anime: {
    id: number
    idMal: number
    title: {
      romaji: string
      english: string | null
      native: string | null
    }
    episodes: number
    characters?: {
      edges: Array<{
        node: {
          id: number
          name: {
            full: string
          }
          image: {
            large: string
          }
        }
        role: string
      }>
    }
    recommendations?: {
      nodes: Array<{
        mediaRecommendation: {
          id: number
          title: {
            romaji: string
            english: string | null
          }
          coverImage: {
            large: string
          }
        }
      }>
    }
    streamingEpisodes?: Array<{
      title: string
      thumbnail: string
    }>
  }
  episode: any
  comments: any[]
  currentTab: string
}

export function WatchPageClient({ anime, episode, comments, currentTab }: WatchPageClientProps) {
  const [mounted, setMounted] = useState(false)
  const [titleLanguage, setTitleLanguage] = useState<'romaji' | 'english' | 'native'>('romaji')
  const [players, setPlayers] = useState<DocchiPlayer[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<DocchiPlayer | null>(null)
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(false)
  const [isPlayerMenuOpen, setIsPlayerMenuOpen] = useState(false)
  const [translatedDescription, setTranslatedDescription] = useState<string>("")

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem('titleLanguage') as 'romaji' | 'english' | 'native' || 'romaji'
    setTitleLanguage(savedLanguage)
  }, [])

  useEffect(() => {
    async function translateDescription() {
      if (episode?.description) {
        try {
          const translated = await translateWithCache(episode.description)
          setTranslatedDescription(translated)
        } catch (error) {
          console.error("Error translating episode description:", error)
          setTranslatedDescription(episode.description)
        }
      }
    }
    translateDescription()
  }, [episode?.description])

  const loadPlayers = async () => {
    setIsLoadingPlayers(true)
    try {
      const slug = getSlugFromTitle(anime?.title?.romaji || '')
      console.log('Fetching players for:', {
        animeTitle: anime?.title?.romaji,
        slug: slug,
        episodeNumber: episode.number
      })
      
      const episodePlayers = await getEpisodePlayers(slug, episode.number)
      console.log('Docchi API Response:', {
        rawResponse: episodePlayers,
        playerCount: episodePlayers.length,
        firstPlayer: episodePlayers[0],
      })
      
      setPlayers(episodePlayers)
      if (episodePlayers.length > 0) {
        setSelectedPlayer(episodePlayers[0])
      }
      setIsPlayerMenuOpen(true)
    } catch (error) {
      console.error('Error loading players:', error)
    } finally {
      setIsLoadingPlayers(false)
    }
  }

  if (!anime) {
    return <div>Anime not found</div>
  }

  const getTitle = () => {
    if (!mounted || !anime?.title) return anime?.title?.romaji || ''
    return anime.title[titleLanguage] || anime.title.romaji || ''
  }

  const characters = anime.characters?.edges || []
  const episodes = Array.from({ length: anime.episodes || 0 }, (_, i) => {
    const episodeNumber = i + 1
    const streamingEpisode = anime.streamingEpisodes?.[i]
    return {
      id: episodeNumber,
      number: episodeNumber,
      title: `Odcinek ${episodeNumber}`,
      thumbnail: streamingEpisode?.thumbnail || "/placeholder.svg"
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4 space-y-6">
          <div className="flex items-center justify-between">
            <Link href={`/anime/${anime.id}`} className="text-sm text-muted-foreground hover:text-foreground">
              ← Wróć do strony anime
            </Link>
            <div className="flex items-center gap-2">
              <Sheet open={isPlayerMenuOpen} onOpenChange={setIsPlayerMenuOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    onClick={loadPlayers}
                    disabled={isLoadingPlayers}
                  >
                    {isLoadingPlayers ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Ładowanie playerów...
                      </>
                    ) : players.length > 0 ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Zmień player ({players.length})
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Załaduj playery
                      </>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Dostępne playery</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-100px)] mt-4">
                    <div className="space-y-2">
                      {players.map((player) => (
                        <Button
                          key={player.id}
                          variant={selectedPlayer?.id === player.id ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => {
                            setSelectedPlayer(player)
                            setIsPlayerMenuOpen(false)
                          }}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">
                              {player.translator_title || 'Unknown'} 
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {player.player_hosting}
                            </span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
              <Button variant="outline" asChild>
                <Link href={`/watch-together/create?animeId=${anime.id}&episode=${episode.number}`}>
                  Oglądaj z innymi
                </Link>
              </Button>
            </div>
          </div>

          {selectedPlayer ? (
            <VideoPlayer
              src={selectedPlayer.player}
              poster={episode.thumbnail}
              sections={episode.sections?.map((section: any) => ({
                name: section.type,
                start: section.start,
                end: section.end,
                color: section.type === "OPENING" ? "#ef4444" : "#3b82f6",
              })) || []}
              animeId={anime.id}
              episodeId={episode.number}
              quality={selectedPlayer.quality}
            />
          ) : (
            <div className="aspect-video bg-accent/10 rounded-lg flex items-center justify-center">
              <Button 
                variant="outline" 
                onClick={loadPlayers}
                disabled={isLoadingPlayers}
                className="bg-background/80"
              >
                {isLoadingPlayers ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Ładowanie playerów...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Kliknij aby załadować playery
                  </>
                )}
              </Button>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold">
                {getTitle()}
              </h1>
              <h2 className="text-xl">
                Odcinek {episode.number}
              </h2>
            </div>

            {translatedDescription && (
              <p className="text-muted-foreground">{translatedDescription}</p>
            )}

            <div className="flex justify-between">
              <Button
                variant="outline"
                disabled={episode.number === 1}
                asChild
              >
                <Link href={`/anime/${anime.id}/watch?episode=${episode.number - 1}&tab=${currentTab}`}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Poprzedni odcinek
                </Link>
              </Button>
              <Button
                variant="outline"
                disabled={episode.number === anime.episodes}
                asChild
              >
                <Link href={`/anime/${anime.id}/watch?episode=${episode.number + 1}&tab=${currentTab}`}>
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
                <Comments comments={comments} animeId={anime.id} />
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
                    <Link href={`/anime/${anime.idMal}/watch?episode=${episode.number}&tab=episodes`}>
                      Odcinki
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger value="characters" asChild>
                    <Link href={`/anime/${anime.idMal}/watch?episode=${episode.number}&tab=characters`}>
                      Postacie
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger value="similar" asChild>
                    <Link href={`/anime/${anime.idMal}/watch?episode=${episode.number}&tab=similar`}>
                      Podobne Anime
                    </Link>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="episodes" className="mt-2">
                  <ScrollArea className="h-[calc(100vh-250px)]">
                    <div className="space-y-2 p-2">
                      {episodes.map((ep) => (
                        <Link
                          key={ep.id}
                          href={`/anime/${anime.idMal}/watch?episode=${ep.number}&tab=${currentTab}`}
                          className={`block p-2 rounded-lg transition-colors ${
                            ep.number === episode.number ? 'bg-accent' : 'hover:bg-accent/50'
                          }`}
                        >
                          <div className="relative aspect-video mb-1">
                            {ep.thumbnail && ep.thumbnail !== "/placeholder.svg" ? (
                              <>
                                <Image
                                  src={ep.thumbnail}
                                  alt={ep.title}
                                  fill
                                  className="rounded object-cover shadow-md"
                                />
                                <div className="absolute top-2 right-2 flex gap-1">
                                  <div className="w-6 h-4 relative overflow-hidden rounded shadow-sm bg-black/20 backdrop-blur-sm">
                                    <JP className="w-full h-full object-cover" />
                                  </div>
                                  <div className="w-6 h-4 relative overflow-hidden rounded shadow-sm bg-black/20 backdrop-blur-sm">
                                    <PL className="w-full h-full object-cover" />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full rounded bg-accent/50 flex items-center justify-center shadow-md">
                                <p className="text-sm text-muted-foreground text-center px-2">
                                  Brak Miniatury
                                </p>
                              </div>
                            )}
                          </div>
                          <p className="text-sm font-medium">{ep.title}</p>
                        </Link>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="characters" className="mt-2">
                  <ScrollArea className="h-[calc(100vh-250px)]">
                    <div className="grid grid-cols-2 gap-2">
                      {characters.slice(0, ITEMS_PER_PAGE).map((character: any) => (
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