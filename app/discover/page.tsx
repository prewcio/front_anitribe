"use client"

import { useState, useCallback, useEffect } from "react"
import { getAnimeByFilters, type SortOption } from "@/lib/api/anilist"
import AnimeGrid from "@/components/AnimeGrid"
import BrowseFilters, { type FiltersState } from "@/components/BrowseFilters"
import { SortingOptions } from "@/components/SortingOptions"
import LoadingGrid from "@/components/LoadingGrid"
import { InfiniteScroll } from "@/components/InfiniteScroll"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function DiscoverPage() {
  const [anime, setAnime] = useState<any[]>([])
  const [pageInfo, setPageInfo] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSort, setCurrentSort] = useState<SortOption>("POPULARITY_DESC")
  const [currentFilters, setCurrentFilters] = useState<FiltersState>({
    genres: [],
    year: [1990, new Date().getFullYear()],
    format: [],
    status: "RELEASING",
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
        format: filters.format,
        status: filters.status,
      })
      return { media, pageInfo }
    } catch (error) {
      console.error("Nie udało się pobrać anime:", error)
      setError(error instanceof Error ? error.message : "Wystąpił nieznany błąd")
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
    [fetchAnime, currentFilters], // Added currentFilters dependency
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
  }, [loadAnime, currentSort, currentFilters])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-64 shrink-0">
          <BrowseFilters currentFilters={currentFilters} onFiltersApply={handleFiltersApply} />
        </aside>
        <main className="flex-1">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Odkrywaj Anime</h1>
            <SortingOptions currentSort={currentSort} onSortChange={handleSortChange} />
          </div>
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Błąd</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : isInitialLoading ? (
            <LoadingGrid />
          ) : (
            <>
              <AnimeGrid items={anime} />
              {isLoading && <LoadingGrid />}
              {pageInfo?.hasNextPage && <InfiniteScroll onLoadMore={loadMore} hasMore={pageInfo.hasNextPage} />}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

