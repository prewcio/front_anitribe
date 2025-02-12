"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Episode } from "@/types/anime"
import Link from "next/link"
import { Tooltip } from "react-tooltip"
import * as Flags from "country-flag-icons/react/3x2"

interface CollapsibleSideMenuProps {
  characters: any[]
  recommendations: any[]
  episodes: Episode[]
  animeId: number
  currentEpisode: number
}

const ITEMS_PER_PAGE = 7

export function CollapsibleSideMenu({
  characters,
  recommendations,
  episodes,
  animeId,
  currentEpisode,
}: CollapsibleSideMenuProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [charactersPage, setCharactersPage] = useState(0)
  const [recommendationsPage, setRecommendationsPage] = useState(0)

  const showMoreCharacters = () => {
    setCharactersPage((prev) => ((prev + 1) * ITEMS_PER_PAGE < characters.length ? prev + 1 : 0))
  }

  const showMoreRecommendations = () => {
    setRecommendationsPage((prev) => ((prev + 1) * ITEMS_PER_PAGE < recommendations.length ? prev + 1 : 0))
  }

  const renderLanguageFlags = (languages: { dubbing: string[]; subtitles: string[] }) => {
    const allLanguages = [...new Set([...languages.dubbing, ...languages.subtitles])]
    return allLanguages.map((lang) => {
      const FlagComponent = (Flags as any)[lang]
      return FlagComponent ? (
        <Tooltip
          key={lang}
          content={`${languages.dubbing.includes(lang) ? "Dubbing" : ""} ${languages.subtitles.includes(lang) ? "Subtitles" : ""}`.trim()}
        >
          <FlagComponent className="w-5 h-5 mr-1" />
        </Tooltip>
      ) : null
    })
  }

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-12" : "w-full lg:w-1/3 xl:w-1/4"
      } bg-background-secondary border-l border-border`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 rounded-none border-b border-border"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
      {!isCollapsed && (
        <div className="h-[calc(100vh-3rem)] overflow-y-auto">
          <Tabs defaultValue="episodes" className="h-full">
            <TabsList className="sticky top-0 z-10 w-full rounded-none border-b border-border bg-background-secondary">
              <TabsTrigger value="episodes" className="flex-1">
                Odcinki
              </TabsTrigger>
              <TabsTrigger value="characters" className="flex-1">
                Postacie
              </TabsTrigger>
              <TabsTrigger value="similar" className="flex-1">
                Podobne
              </TabsTrigger>
            </TabsList>
            <TabsContent value="episodes" className="p-0 m-0">
              <div className="space-y-1 p-2">
                {episodes.map((episode) => (
                  <Link
                    key={episode.id}
                    href={`/anime/${animeId}/watch?episode=${episode.number}`}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      episode.number === currentEpisode ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                    }`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded bg-background/20">
                      {episode.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Tooltip content={episode.title}>
                        <p className="truncate">{episode.title}</p>
                      </Tooltip>
                    </div>
                    <div className="flex">{renderLanguageFlags(episode.languages)}</div>
                  </Link>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="characters" className="p-2 m-0">
              <div className="space-y-2">
                {characters
                  .slice(charactersPage * ITEMS_PER_PAGE, (charactersPage + 1) * ITEMS_PER_PAGE)
                  .map((character) => (
                    <Link
                      key={character.node.id}
                      href={`/character/${character.node.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <img
                        src={character.node.image.medium || "/placeholder.svg"}
                        alt={character.node.name.full}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium">{character.node.name.full}</p>
                        <p className="text-sm text-muted-foreground">
                          {character.role === "MAIN" ? "Główna" : "Drugoplanowa"}
                        </p>
                      </div>
                    </Link>
                  ))}
                {characters.length > ITEMS_PER_PAGE && (
                  <Button onClick={showMoreCharacters} className="w-full mt-2">
                    {charactersPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE >= characters.length ? (
                      <>
                        <ChevronUp className="mr-2 h-4 w-4" /> Pokaż pierwsze
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-2 h-4 w-4" /> Pokaż więcej
                      </>
                    )}
                  </Button>
                )}
              </div>
            </TabsContent>
            <TabsContent value="similar" className="p-2 m-0">
              <div className="space-y-2">
                {recommendations
                  .slice(recommendationsPage * ITEMS_PER_PAGE, (recommendationsPage + 1) * ITEMS_PER_PAGE)
                  .map((anime) => (
                    <Link
                      key={anime.id}
                      href={`/anime/${anime.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <img
                        src={anime.coverImage.medium || "/placeholder.svg"}
                        alt={anime.title.romaji}
                        className="w-12 h-16 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium">{anime.title.romaji}</p>
                      </div>
                    </Link>
                  ))}
                {recommendations.length > ITEMS_PER_PAGE && (
                  <Button onClick={showMoreRecommendations} className="w-full mt-2">
                    {recommendationsPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE >= recommendations.length ? (
                      <>
                        <ChevronUp className="mr-2 h-4 w-4" /> Pokaż pierwsze
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-2 h-4 w-4" /> Pokaż więcej
                      </>
                    )}
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

