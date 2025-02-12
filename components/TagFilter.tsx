"use client"

import { useState, useCallback } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { tagCategories } from "@/lib/tagCategories"

interface TagFilterProps {
  genres: string[]
  excludedGenres: string[]
  onGenresChange: (included: string[], excluded: string[]) => void
}

export function TagFilter({ genres, excludedGenres, onGenresChange }: TagFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const toggleGenre = useCallback(
    (genre: string) => {
      if (genres.includes(genre)) {
        onGenresChange(
          genres.filter((g) => g !== genre),
          [...excludedGenres, genre],
        )
      } else if (excludedGenres.includes(genre)) {
        onGenresChange(
          genres,
          excludedGenres.filter((g) => g !== genre),
        )
      } else {
        onGenresChange([...genres, genre], excludedGenres)
      }
    },
    [genres, excludedGenres, onGenresChange],
  )

  const getGenreState = (genre: string): "included" | "excluded" | "not-selected" => {
    if (genres.includes(genre)) return "included"
    if (excludedGenres.includes(genre)) return "excluded"
    return "not-selected"
  }

  const filteredCategories = tagCategories
    .map((category) => ({
      ...category,
      tags: category.tags.filter(
        (tag) =>
          tag.polish.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tag.english.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.tags.length > 0)

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Szukaj gatunków..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <Accordion type="multiple" className="w-full">
          {filteredCategories.map((category) => (
            <AccordionItem key={category.name} value={category.name}>
              <AccordionTrigger className="text-sm hover:no-underline">{category.name}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2">
                  {category.tags.map((tag) => {
                    const state = getGenreState(tag.english)
                    return (
                      <Button
                        key={tag.english}
                        variant={state === "included" ? "default" : state === "excluded" ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => toggleGenre(tag.english)}
                        className={`rounded-full ${
                          state === "included"
                            ? "bg-primary text-primary-foreground"
                            : state === "excluded"
                              ? "bg-destructive text-destructive-foreground"
                              : "bg-background text-foreground"
                        }`}
                      >
                        {tag.polish}
                      </Button>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  )
}

