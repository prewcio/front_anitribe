import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SortOption } from "@/lib/api/anilist"

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "POPULARITY_DESC", label: "Popularność" },
  { value: "SCORE_DESC", label: "Ocena" },
  { value: "TRENDING_DESC", label: "Trendy" },
  { value: "START_DATE_DESC", label: "Data premiery" },
]

interface SortingOptionsProps {
  currentSort: SortOption
  onSortChange: (sort: SortOption) => void
}

export function SortingOptions({ currentSort, onSortChange }: SortingOptionsProps) {
  return (
    <Select value={currentSort} onValueChange={onSortChange}>
      <SelectTrigger className="w-[180px]">
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
  )
}

