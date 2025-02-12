"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TagFilter } from "@/components/TagFilter"

interface FiltersState {
  countryOfOrigin: string
  sourceMaterial: string
  year: [number, number]
  episodes: [number, number]
  duration: [number, number]
  genres: string[]
  excludedGenres: string[]
}

const currentYear = new Date().getFullYear()

export default function BrowseFilters({
  currentFilters,
  onFiltersApply,
}: {
  currentFilters: { [key: string]: string | string[] | undefined }
  onFiltersApply: (filters: FiltersState) => void
}) {
  const router = useRouter()
  const [filters, setFilters] = useState<FiltersState>({
    countryOfOrigin: (currentFilters.countryOfOrigin as string) || "any",
    sourceMaterial: (currentFilters.sourceMaterial as string) || "any",
    year: [Number(currentFilters.yearFrom) || 1990, Number(currentFilters.yearTo) || currentYear],
    episodes: [Number(currentFilters.episodesFrom) || 1, Number(currentFilters.episodesTo) || 150],
    duration: [Number(currentFilters.durationFrom) || 1, Number(currentFilters.durationTo) || 180],
    genres: Array.isArray(currentFilters.genres)
      ? currentFilters.genres
      : typeof currentFilters.genres === "string"
        ? currentFilters.genres.split(",")
        : [],
    excludedGenres: Array.isArray(currentFilters.excludedGenres)
      ? currentFilters.excludedGenres
      : typeof currentFilters.excludedGenres === "string"
        ? currentFilters.excludedGenres.split(",")
        : [],
  })

  const applyFilters = () => {
    const queryParams = new URLSearchParams()

    if (filters.countryOfOrigin !== "any") {
      queryParams.set("countryOfOrigin", filters.countryOfOrigin)
    }
    if (filters.sourceMaterial !== "any") {
      queryParams.set("sourceMaterial", filters.sourceMaterial)
    }
    if (filters.year[0] !== 1990) {
      queryParams.set("yearFrom", filters.year[0].toString())
    }
    if (filters.year[1] !== currentYear) {
      queryParams.set("yearTo", filters.year[1].toString())
    }
    if (filters.episodes[0] !== 1) {
      queryParams.set("episodesFrom", filters.episodes[0].toString())
    }
    if (filters.episodes[1] !== 150) {
      queryParams.set("episodesTo", filters.episodes[1].toString())
    }
    if (filters.duration[0] !== 1) {
      queryParams.set("durationFrom", filters.duration[0].toString())
    }
    if (filters.duration[1] !== 180) {
      queryParams.set("durationTo", filters.duration[1].toString())
    }
    if (filters.genres.length > 0) {
      filters.genres.forEach((genre) => queryParams.append("genres", genre))
    }
    if (filters.excludedGenres.length > 0) {
      filters.excludedGenres.forEach((genre) => queryParams.append("excludedGenres", genre))
    }

    const queryString = queryParams.toString()
    router.push(queryString ? `/browse?${queryString}` : "/browse")
    if (typeof onFiltersApply === "function") {
      onFiltersApply(filters)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Kraj pochodzenia</label>
          <Select
            value={filters.countryOfOrigin}
            onValueChange={(value) => setFilters({ ...filters, countryOfOrigin: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Dowolny" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Dowolny</SelectItem>
              <SelectItem value="JP">Japonia</SelectItem>
              <SelectItem value="CN">Chiny</SelectItem>
              <SelectItem value="KR">Korea</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Materiał źródłowy</label>
          <Select
            value={filters.sourceMaterial}
            onValueChange={(value) => setFilters({ ...filters, sourceMaterial: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Dowolny" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Dowolny</SelectItem>
              <SelectItem value="MANGA">Manga</SelectItem>
              <SelectItem value="LIGHT_NOVEL">Light Novel</SelectItem>
              <SelectItem value="VISUAL_NOVEL">Visual Novel</SelectItem>
              <SelectItem value="ORIGINAL">Original</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="year">
          <AccordionTrigger>Rok produkcji</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 px-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{filters.year[0]}</span>
                <span>{filters.year[1]}</span>
              </div>
              <Slider
                value={filters.year}
                min={1990}
                max={currentYear}
                step={1}
                onValueChange={(value) => setFilters({ ...filters, year: value as [number, number] })}
                className="mt-1"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="episodes">
          <AccordionTrigger>Liczba odcinków</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 px-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{filters.episodes[0]}</span>
                <span>{filters.episodes[1]}</span>
              </div>
              <Slider
                value={filters.episodes}
                min={1}
                max={150}
                step={1}
                onValueChange={(value) => setFilters({ ...filters, episodes: value as [number, number] })}
                className="mt-1"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="duration">
          <AccordionTrigger>Długość odcinka (minuty)</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 px-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{filters.duration[0]}</span>
                <span>{filters.duration[1]}</span>
              </div>
              <Slider
                value={filters.duration}
                min={1}
                max={180}
                step={1}
                onValueChange={(value) => setFilters({ ...filters, duration: value as [number, number] })}
                className="mt-1"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="genres" className="border-b">
          <AccordionTrigger>Gatunki</AccordionTrigger>
          <AccordionContent>
            <TagFilter
              genres={filters.genres}
              excludedGenres={filters.excludedGenres}
              onGenresChange={(included, excluded) =>
                setFilters((prev) => ({ ...prev, genres: included, excludedGenres: excluded }))
              }
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button onClick={applyFilters} className="w-full">
        Zastosuj filtry
      </Button>
    </div>
  )
}

