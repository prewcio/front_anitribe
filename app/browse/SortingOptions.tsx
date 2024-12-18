"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SortOption } from "@/lib/api/anilist"

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "TRENDING_DESC", label: "Popularne" },
  { value: "POPULARITY_DESC", label: "Najpopularniejsze" },
  { value: "SCORE_DESC", label: "Najwyżej oceniane" },
  { value: "TITLE_ROMAJI", label: "Tytuł" },
  { value: "FAVOURITES_DESC", label: "Ulubione" },
  { value: "UPDATED_AT_DESC", label: "Ostatnio dodane" },
  { value: "START_DATE_DESC", label: "Data premiery" },
]

interface SortingOptionsProps {
  currentSort: SortOption
  onSortChange: (sort: SortOption) => void
}

export function SortingOptions({ currentSort, onSortChange }: SortingOptionsProps) {
  return (
    <div className="mb-4">
      <Select value={currentSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Wybierz sortowanie" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

