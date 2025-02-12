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
  const [currentSort, setCurrentSort] = useState<SortOption>("TRENDING_DESC")
  const [currentFilters, setCurrentFilters] = useState<FiltersState>(() => {
    return {
      countryOfOrigin: searchParams.get("countryOfOrigin") || "any",
      sourceMaterial: searchParams.get("sourceMaterial") || "any",
      year: [
        Number(searchParams.get("yearFrom")) || 1990,
        Number(searchParams.get("yearTo")) || new Date().getFullYear(),
      ],
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
        year: filters.year[1],
        // Add more filter parameters as needed
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

  const handleSortChange = useCallback(
    (newSort: SortOption) => {
      setCurrentSort(newSort)
      loadAnime(1, newSort, currentFilters)
    },
    [loadAnime, currentFilters],
  )

  const handleFiltersApply = useCallback(
    (newFilters: FiltersState) => {
      setCurrentFilters(newFilters)
      loadAnime(1, currentSort, newFilters)
    },
    [loadAnime, currentSort],
  )

  useEffect(() => {
    loadAnime(1, currentSort, currentFilters)
  }, [loadAnime, currentSort, currentFilters]) // Only run on mount

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-64 shrink-0">
          <BrowseFilters currentFilters={currentFilters} onFiltersApply={handleFiltersApply} />
        </aside>
        <main className="flex-1">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Browse Anime</h1>
            <SortingOptions currentSort={currentSort} onSortChange={handleSortChange} />
          </div>
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : isInitialLoading ? (
            <LoadingGrid />
          ) : (
            <>
              <AnimeGrid items={anime} />
              {isLoading && <LoadingGrid />}
              {pageInfo?.hasNextPage && anime.length > 0 && (
                <InfiniteScroll 
                  onLoadMore={loadMore} 
                  hasMore={pageInfo.hasNextPage}
                  rootMargin="10px"
                  triggerImmediately
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

