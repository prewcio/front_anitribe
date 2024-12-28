"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export default function SearchBar() {
  const [open, setOpen] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const router = useRouter()

  const handleSearch = async (value: string) => {
    if (value.length < 2) return

    // This would call your API that integrates with AniDB/AniList
    const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`)
    const data = await response.json()
    setResults(data)
  }

  return (
    <>
      <Button variant="outline" className="w-64 justify-start text-text-secondary" onClick={() => setOpen(true)}>
        <Search className="mr-2 h-4 w-4" />
        Search anime...
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search anime (English, Romaji, or Japanese)..." onValueChange={handleSearch} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Results">
            {results.map((anime) => (
              <CommandItem
                key={anime.id}
                onSelect={() => {
                  router.push(`/anime/${anime.id}`)
                  setOpen(false)
                }}
              >
                <img
                  src={anime.image || "/placeholder.svg"}
                  alt={anime.title.english}
                  className="w-8 h-12 object-cover mr-2"
                />
                <div>
                  <p>{anime.title.english}</p>
                  <p className="text-sm text-text-secondary">
                    {anime.title.japanese} · {anime.title.romaji}
                  </p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

