"use client"

import { useState, useCallback, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { getAnimeByFilters, type SortOption } from "@/lib/api/anilist"
import AnimeGrid from "@/components/AnimeGrid"
import BrowseFilters from "./BrowseFilters"
import { SortingOptions } from "./SortingOptions"
import LoadingGrid from "@/components/LoadingGrid"
import { InfiniteScroll } from "@/components/InfiniteScroll"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { FiltersState } from "./BrowseFilters"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { translateTagToPolish } from "@/lib/utils/tagTranslation"

export default function BrowsePage() {
  return (
    <Suspense fallback={<LoadingGrid />}>
      <BrowseContent />
    </Suspense>
  )
}

function BrowseContent() {
  const searchParams = useSearchParams()
  const [anime, setAnime] = useState<any[]>([])
  const [pageInfo, setPageInfo] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSort, setCurrentSort] = useState<SortOption>(() => {
    return searchParams.get("sort") as SortOption || "TRENDING_DESC"
  })
  const [currentFilters, setCurrentFilters] = useState<FiltersState>(() => {
    return {
      countryOfOrigin: searchParams.get("countryOfOrigin") || "any",
      sourceMaterial: searchParams.get("sourceMaterial") || "any",
      season: searchParams.get("season") || undefined,
      year: searchParams.get("year") ? Number(searchParams.get("year")) : undefined,
      episodes: [Number(searchParams.get("episodesFrom")) || 1, Number(searchParams.get("episodesTo")) || 150],
      duration: [Number(searchParams.get("durationFrom")) || 1, Number(searchParams.get("durationTo")) || 180],
      genres: searchParams.getAll("genres"),
      excludedGenres: searchParams.getAll("excludedGenres"),
    }
  })

  const fetchAnime = useCallback(async (page: number, sort: SortOption, filters: FiltersState) => {
    setIsLoading(true)
    setError(null)
    try {
      const { media, pageInfo } = await getAnimeByFilters({
        page: page.toString(),
        sort,
        genres: filters.genres,
        excludedGenres: filters.excludedGenres,
        year: filters.year,
        season: filters.season,
      })
      return { media, pageInfo }
    } catch (error) {
      console.error("Failed to fetch anime:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadAnime = useCallback(
    async (page: number, sort: SortOption, filters: FiltersState) => {
      const result = await fetchAnime(page, sort, filters)
      if (result) {
        setAnime(result.media)
        setPageInfo(result.pageInfo)
        setCurrentPage(page)
      }
      setIsInitialLoading(false)
    },
    [fetchAnime],
  )

  const loadMore = useCallback(async () => {
    if (isLoading || !pageInfo?.hasNextPage) return

    const result = await fetchAnime(currentPage + 1, currentSort, currentFilters)
    if (result) {
      setAnime((prev) => [...prev, ...result.media])
      setPageInfo(result.pageInfo)
      setCurrentPage((prev) => prev + 1)
    }
  }, [isLoading, pageInfo, currentPage, currentSort, currentFilters, fetchAnime])

  useEffect(() => {
    loadAnime(1, currentSort, currentFilters)
  }, [loadAnime, currentSort, currentFilters])

  const formatSeason = (season: string) => {
    const seasons: Record<string, string> = {
      WINTER: "Zima",
      SPRING: "Wiosna",
      SUMMER: "Lato",
      FALL: "Jesień"
    }
    return seasons[season] || season
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 lg:w-80">
          <BrowseFilters currentFilters={currentFilters} onFiltersApply={setCurrentFilters} />
        </aside>
        <main className="flex-1">
          <div className="mb-4 flex flex-col items-start gap-2">
            <div className="w-full flex justify-between items-center">
              <h1 className="text-2xl font-bold">
                {currentFilters.season && currentFilters.year
                  ? `Sezon ${formatSeason(currentFilters.season)} ${currentFilters.year}`
                  : "Przeglądaj Anime"}
              </h1>
              <Select value={currentSort} onValueChange={(value) => setCurrentSort(value as SortOption)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sortuj" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRENDING_DESC">Popularne</SelectItem>
                  <SelectItem value="POPULARITY_DESC">Najpopularniejsze</SelectItem>
                  <SelectItem value="SCORE_DESC">Najwyżej oceniane</SelectItem>
                  <SelectItem value="START_DATE_DESC">Najnowsze</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentFilters.genres.map((genre) => (
                <Button
                  key={genre}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newFilters = { ...currentFilters }
                    newFilters.genres = newFilters.genres.filter(g => g !== genre)
                    setCurrentFilters(newFilters)
                  }}
                  className="text-purple-600 border-purple-300 bg-purple-50 hover:bg-purple-100 px-2"
                >
                  {translateTagToPolish(genre)} ×
                </Button>
              ))}
              {currentFilters.excludedGenres.map((genre) => (
                <Button
                  key={genre}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newFilters = { ...currentFilters }
                    newFilters.excludedGenres = newFilters.excludedGenres.filter(g => g !== genre)
                    setCurrentFilters(newFilters)
                  }}
                  className="text-purple-600 border-purple-300 bg-purple-50 hover:bg-purple-100 px-2"
                >
                  Wykluczono: {translateTagToPolish(genre)} ×
                </Button>
              ))}
              {currentFilters.season && currentFilters.year && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newFilters = { ...currentFilters }
                    newFilters.season = undefined
                    newFilters.year = undefined
                    setCurrentFilters(newFilters)
                  }}
                  className="text-purple-600 border-purple-300 bg-purple-50 hover:bg-purple-100 px-2"
                >
                  Sezon: {formatSeason(currentFilters.season)} {currentFilters.year} ×
                </Button>
              )}
            </div>
          </div>
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Błąd</AlertTitle>
              <AlertDescription>{error || "Wystąpił nieznany błąd"}</AlertDescription>
            </Alert>
          ) : isInitialLoading ? (
            <LoadingGrid />
          ) : (
            <>
              {anime.length > 0 ? (
                <AnimeGrid items={anime} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nie znaleziono żadnych anime spełniających kryteria.</p>
                </div>
              )}
              {isLoading && <LoadingGrid />}
              {pageInfo?.hasNextPage && anime.length > 0 && (
                <InfiniteScroll 
                  onLoadMore={loadMore} 
                  hasMore={pageInfo.hasNextPage}
                  rootMargin="10px"
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function ErrorMessage() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">An error occurred</h1>
      <p>Please try again later.</p>
    </div>
  )
}

