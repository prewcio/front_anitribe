"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TagFilter } from "@/components/TagFilter"

export interface FiltersState {
  countryOfOrigin: string
  sourceMaterial: string
  year: [number, number]
  episodes: [number, number]
  duration: [number, number]
  genres: string[]
  excludedGenres: string[]
}

const currentYear = new Date().getFullYear()

interface BrowseFiltersProps {
  currentFilters: FiltersState
  onFiltersApply: (filters: FiltersState) => void
}

export default function BrowseFilters({ currentFilters, onFiltersApply }: BrowseFiltersProps) {
  const [filters, setFilters] = useState<FiltersState>(currentFilters)

  useEffect(() => {
    setFilters(currentFilters)
  }, [currentFilters])

  const handleFilterChange = useCallback((key: keyof FiltersState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const applyFilters = useCallback(() => {
    onFiltersApply(filters)
  }, [filters, onFiltersApply])

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Kraj pochodzenia</label>
          <Select
            value={filters.countryOfOrigin}
            onValueChange={(value) => handleFilterChange("countryOfOrigin", value)}
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
          <Select value={filters.sourceMaterial} onValueChange={(value) => handleFilterChange("sourceMaterial", value)}>
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
                onValueChange={(value) => handleFilterChange("year", value)}
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
                onValueChange={(value) => handleFilterChange("episodes", value)}
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
                onValueChange={(value) => handleFilterChange("duration", value)}
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
              onGenresChange={(included, excluded) => {
                handleFilterChange("genres", included)
                handleFilterChange("excludedGenres", excluded)
              }}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="space-y-2">
        <Button onClick={applyFilters} className="w-full">
          Zastosuj filtry
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onFiltersApply({
            countryOfOrigin: "any",
            sourceMaterial: "any",
            year: [1990, new Date().getFullYear() + 1],
            episodes: [1, 150],
            duration: [1, 180],
            genres: [],
            excludedGenres: []
          })}
          className="w-full"
        >
          Resetuj filtry
        </Button>
      </div>
    </div>
  )
}

