'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CharacterEdge {
  node: {
    id: number;
    name: {
      full: string;
      native: string;
    };
    image: {
      medium: string;
      large: string;
    };
  };
  role: string;
  voiceActors: Array<{
    id: number;
    name: {
      full: string;
      native: string;
    };
    image: {
      medium: string;
    };
  }>;
}

interface CharacterListProps {
  characters: {
    edges: CharacterEdge[];
  };
}

const translateRole = (role: string) => {
  switch (role) {
    case "MAIN":
      return "GŁÓWNA";
    case "SUPPORTING":
      return "DRUGOPLANOWA";
    default:
      return role;
  }
};

export default function CharacterList({ characters }: CharacterListProps) {
  const [mounted, setMounted] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      })
    }
  }

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      })
    }
  }

  if (!mounted) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Postacie</h2>
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[240px] flex-none">
                <div className="aspect-[2/3] bg-muted rounded-lg" />
                <div className="h-[72px] bg-muted mt-2 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!characters?.edges?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        Postacie
      </h2>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
        >
          {characters.edges.map((edge) => (
            <Link 
              key={edge.node.id} 
              href={`/character/${edge.node.id}`}
            >
              <Card className="overflow-hidden h-full w-[240px] flex-none">
                <div className="aspect-[2/3] relative">
                  <Image
                    src={edge.node.image.large || "/placeholder.svg"}
                    alt={edge.node.name.full}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3 flex flex-col justify-between">
                  <h3 className="font-medium line-clamp-2">
                    {edge.node.name.full}
                  </h3>
                  {(edge.role === "MAIN" || edge.role === "SUPPORTING") && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {translateRole(edge.role)}
                    </p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 -translate-x-1/2 hidden md:flex"
          onClick={handleScrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 translate-x-1/2 hidden md:flex"
          onClick={handleScrollRight}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

