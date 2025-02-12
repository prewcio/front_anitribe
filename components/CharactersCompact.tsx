"use client"

import { useState } from "react"
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

interface CharactersCompactProps {
  characters: CharacterData[]
}

export default function CharactersCompact({ characters = [] }: CharactersCompactProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const charactersPerPage = 4

  const nextCharacters = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + charactersPerPage, characters.length - charactersPerPage))
  }

  const previousCharacters = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - charactersPerPage, 0))
  }

  return (
    <div className="relative">
      <h3 className="text-lg font-semibold mb-2">Główne postacie</h3>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 z-10"
          onClick={previousCharacters}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex space-x-2 overflow-hidden">
          {characters.slice(currentIndex, currentIndex + charactersPerPage).map((character) => (
            <Link href={`/character/${character.node.id}`} key={character.node.id}>
              <Card className="w-24 flex-shrink-0 overflow-hidden bg-card hover:bg-accent transition-colors">
                <div className="aspect-[3/4] relative">
                  <img
                    src={character.node.image?.medium || "/placeholder.svg"}
                    alt={character.node.name.full}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-1">
                  <p className="font-medium text-xs truncate">{character.node.name.full}</p>
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
          onClick={nextCharacters}
          disabled={currentIndex >= characters.length - charactersPerPage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

