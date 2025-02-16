"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { searchAnime } from "@/lib/api/hybrid"
import { useDebounce } from "@/lib/hooks/useDebounce"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface AnimeResult {
  id: number
  title: {
    romaji: string
    english: string | null
    native: string
  }
  coverImage: {
    medium: string
  }
  format: string
  episodes: number | null
  status: string
  startDate: {
    year: number
  }
}

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<AnimeResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debouncedQuery = useDebounce(query, 300)
  const router = useRouter()

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([])
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const searchResults = await searchAnime(searchQuery)
      setResults(searchResults)
    } catch (err) {
      console.error("Search error:", err)
      setError("An error occurred while searching. Please try again.")
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    handleSearch(debouncedQuery)
  }, [debouncedQuery, handleSearch])

  const handleSelectAnime = useCallback(
    (animeId: number) => {
      router.push(`/anime/${animeId}`)
      setOpen(false)
    },
    [router],
  )

  const formatStatus = useCallback((status: string) => {
    const statusMap: { [key: string]: string } = {
      FINISHED: "Zakończone",
      RELEASING: "Emitowane",
      NOT_YET_RELEASED: "Zapowiedziane",
      CANCELLED: "Anulowane",
      HIATUS: "Wstrzymane",
    }
    return statusMap[status] || status
  }, [])

  const formatFormat = useCallback((format: string) => {
    const formatMap: { [key: string]: string } = {
      TV: "Serial TV",
      MOVIE: "Film",
      OVA: "OVA",
      ONA: "ONA",
      SPECIAL: "Special",
      MUSIC: "Teledysk",
      TV_SHORT: "Krótki serial",
    }
    return formatMap[format] || format
  }, [])

  console.log("Search state:", { query, isLoading, error, resultsCount: results.length })

  return (
    <>
      <Button variant="outline" className="w-[200px] justify-start text-muted-foreground" onClick={() => setOpen(true)}>
        <Search className="mr-2 h-4 w-4" />
        Szukaj anime...
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <CommandInput placeholder="Wpisz tytuł anime..." value={query} onValueChange={setQuery} />
          <CommandList className="max-h-[300px] overflow-y-auto custom-scrollbar">
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CommandEmpty>Wyszukiwanie...</CommandEmpty>
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CommandEmpty>
                    <div className="text-red-500">{error}</div>
                    <div className="text-sm text-muted-foreground">Sprawdź konsolę, aby uzyskać więcej szczegółów.</div>
                  </CommandEmpty>
                </motion.div>
              )}
              {!isLoading && !error && query.length >= 2 && results.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CommandEmpty>Brak wyników dla "{query}"</CommandEmpty>
                </motion.div>
              )}
              {!isLoading && !error && query.length >= 2 && results.length > 0 && (
                <CommandGroup heading="Wyniki wyszukiwania">
                  {results.map((anime, index) => (
                    <motion.div
                      key={anime.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <CommandItem
                        onSelect={() => handleSelectAnime(anime.id)}
                        className="cursor-pointer hover:bg-accent py-2"
                      >
                        <div className="flex items-center w-full">
                          <div className="relative w-12 h-16 flex-shrink-0">
                            <Image
                              src={anime.coverImage.medium || "/placeholder.svg"}
                              alt={anime.title.romaji}
                              fill
                              sizes="48px"
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex flex-col ml-3 overflow-hidden">
                            <span className="font-medium text-sm leading-tight truncate">
                              {anime.title.english || anime.title.romaji}
                            </span>
                            <span className="text-xs text-muted-foreground leading-tight truncate">
                              {formatFormat(anime.format)} • {anime.episodes || "?"} odc. • {formatStatus(anime.status)}{" "}
                              • {anime.startDate.year}
                            </span>
                          </div>
                        </div>
                      </CommandItem>
                    </motion.div>
                  ))}
                </CommandGroup>
              )}
            </AnimatePresence>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

