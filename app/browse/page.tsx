"use client"

import { useState, useCallback, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { getAnimeByFilters, type BrowseFilters as MALBrowseFilters } from "@/lib/api/mal"
import AnimeGrid from "@/components/AnimeGrid"
import BrowseFilterPanel, { type FiltersState } from "./BrowseFilters"
import { SortingOptions } from "./SortingOptions"
import LoadingGrid from "@/components/LoadingGrid"
import { InfiniteScroll } from "@/components/InfiniteScroll"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { translateTagToPolish } from "@/lib/utils/tagTranslation"
import { Spinner } from "@/components/ui/spinner"

type SortOption = 'POPULARITY_DESC' | 'SCORE_DESC' | 'START_DATE_DESC';

export default function BrowsePage() {
  const [anime, setAnime] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageInfo, setPageInfo] = useState<{ hasNextPage: boolean; total: number }>()
  const [currentSort, setCurrentSort] = useState<SortOption>('POPULARITY_DESC')
  const [currentFilters, setCurrentFilters] = useState<FiltersState>({
    countryOfOrigin: 'JP',
    sourceMaterial: 'ALL',
    episodes: [0, 100],
    duration: [0, 180],
    genres: [],
    excludedGenres: [],
  })

  const fetchAnime = useCallback(async (filters: MALBrowseFilters) => {
    setIsLoading(true)
    try {
      const data = await getAnimeByFilters(filters)
      return data
    } catch (error) {
      console.error("Error fetching anime:", error)
      setError("Failed to load anime. Please try again later.")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadAnime = useCallback(
    async (page: number, sort: SortOption, filters: FiltersState) => {
      const result = await fetchAnime({
        page: page.toString(),
        sort,
        genres: filters.genres,
        excludedGenres: filters.excludedGenres,
        year: filters.year,
        season: filters.season,
      })
      if (result) {
        setAnime(result.media)
        setPageInfo(result.pageInfo)
        setCurrentPage(page)
      }
      setIsInitialLoading(false)
    },
    [fetchAnime]
  )

  useEffect(() => {
    loadAnime(1, currentSort, currentFilters)
  }, [currentSort, currentFilters, loadAnime])

  const loadMore = useCallback(async () => {
    if (isLoading || !pageInfo?.hasNextPage) return

    const result = await fetchAnime({
      page: (currentPage + 1).toString(),
      sort: currentSort,
      genres: currentFilters.genres,
      excludedGenres: currentFilters.excludedGenres,
      year: currentFilters.year,
      season: currentFilters.season,
    })
    if (result) {
      setAnime((prev) => [...prev, ...result.media])
      setPageInfo(result.pageInfo)
      setCurrentPage(currentPage + 1)
    }
  }, [currentPage, currentSort, currentFilters, fetchAnime, isLoading, pageInfo])

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

  const fetchAnime = useCallback(async (filters: MALBrowseFilters) => {
    setIsLoading(true)
    try {
      const data = await getAnimeByFilters(filters)
      return data
    } catch (error) {
      console.error("Error fetching anime:", error)
      setError("Failed to load anime. Please try again later.")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadAnime = useCallback(
    async (page: number, sort: SortOption, filters: FiltersState) => {
      const result = await fetchAnime({
        page: page.toString(),
        sort,
        genres: filters.genres,
        excludedGenres: filters.excludedGenres,
        year: filters.year,
        season: filters.season,
      })
      if (result) {
        setAnime(result.media)
        setPageInfo(result.pageInfo)
        setCurrentPage(page)
      }
      setIsInitialLoading(false)
    },
    [fetchAnime]
  )

  const loadMore = useCallback(async () => {
    if (isLoading || !pageInfo?.hasNextPage) return

    const result = await fetchAnime({
      page: (currentPage + 1).toString(),
      sort: currentSort,
      genres: currentFilters.genres,
      excludedGenres: currentFilters.excludedGenres,
      year: currentFilters.year,
      season: currentFilters.season,
    })
    if (result) {
      setAnime((prev) => [...prev, ...result.media])
      setPageInfo(result.pageInfo)
      setCurrentPage(currentPage + 1)
    }
  }, [currentPage, currentSort, currentFilters, fetchAnime, isLoading, pageInfo])

  useEffect(() => {
    loadAnime(1, currentSort, currentFilters)
  }, [currentSort, currentFilters, loadAnime])

  const formatSeason = (season: string) => {
    const seasons: Record<string, string> = {
      WINTER: "Zima",
      SPRING: "Wiosna",
      SUMMER: "Lato",
      FALL: "Jesień"
    }
    return seasons[season] || season
  }

  const handleFiltersChange = (newFilters: FiltersState) => {
    setCurrentFilters(newFilters)
  }

  const handleSortChange = (value: string) => {
    setCurrentSort(value as SortOption)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Browse Anime</h1>
          <div className="flex flex-wrap gap-4">
            <BrowseFilterPanel
              currentFilters={currentFilters}
              onFiltersApply={handleFiltersChange}
            />
            <Select value={currentSort} onValueChange={handleSortChange}>
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

