"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface Character {
  node: {
    id: number
    name: {
      full: string
    }
    image: {
      large: string
    }
  }
  role: string
}

interface CharactersProps {
  characters: Character[]
}

const ROLE_TRANSLATIONS: Record<string, string> = {
  MAIN: "Główna",
  SUPPORTING: "Drugoplanowa"
}

export default function Characters({ characters }: CharactersProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
    }
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-4">Postacie</h2>
      <div className="relative group">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide gap-3 py-2"
        >
          {characters.map((character) => (
            <Link
              key={character.node.id}
              href={`/character/${character.node.id}`}
              className="flex-shrink-0 w-[160px]"
            >
              <Card className="overflow-hidden">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={character.node.image.large}
                    alt={character.node.name.full}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-sm line-clamp-1">
                    {character.node.name.full}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {ROLE_TRANSLATIONS[character.role] || character.role}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

