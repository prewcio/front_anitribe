"use client"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface CharacterData {
  id: number
  node: {
    id: number
    name: {
      full: string
      native: string
    }
    image: {
      medium: string
    }
  }
  role: string
}

interface CharactersProps {
  characters: CharacterData[]
}

export default function Characters({ characters = [] }: CharactersProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      setScrollPosition(scrollContainerRef.current.scrollLeft + scrollAmount)
    }
  }

  return (
    <div className="relative">
      <h3 className="text-xl font-semibold mb-4">Postacie</h3>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 z-10"
          onClick={() => scroll("left")}
          disabled={scrollPosition <= 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {characters.map((character) => (
            <Link href={`/character/${character.node.id}`} key={character.node.id}>
              <Card className="w-32 flex-shrink-0 overflow-hidden bg-card hover:bg-accent transition-colors">
                <div className="aspect-[3/4] relative">
                  <img
                    src={character.node.image?.medium || "/placeholder.svg"}
                    alt={character.node.name.full}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="font-medium text-xs truncate">{character.node.name.full}</p>
                  <p className="text-xs text-muted-foreground truncate">{character.node.name.native}</p>
                  <p className="text-xs text-muted-foreground">
                    {character.role === "MAIN" ? "Główna" : "Drugoplanowa"}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 z-10"
          onClick={() => scroll("right")}
          disabled={
            scrollContainerRef.current &&
            scrollPosition >= scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth
          }
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

