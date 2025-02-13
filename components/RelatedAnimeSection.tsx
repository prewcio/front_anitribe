'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface RelatedAnime {
  id: number
  relationType: string
  node: {
    id: number
    title: {
      romaji: string
      english: string
      native: string
    }
    coverImage: {
      large: string
    }
    format: string
    status: string
    episodes: number
    averageScore: number
  }
}

interface RelatedAnimeSectionProps {
  relatedAnime: RelatedAnime[]
}

const getRelationLabel = (type: string) => {
  const labels: Record<string, string> = {
    PREQUEL: "Poprzednia Seria",
    SEQUEL: "Następna Seria",
    SPIN_OFF: "Spin-off",
    SIDE_STORY: "Historia Poboczna",
    PARENT: "Seria Główna",
    ADAPTATION: "Adaptacja",
    ALTERNATIVE: "Alternatywna Historia",
    CHARACTER: "Historia Postaci",
    SUMMARY: "Podsumowanie",
    OTHER: "Powiązane"
  }
  return labels[type] || type
}

export default function RelatedAnimeSection({ relatedAnime }: RelatedAnimeSectionProps) {
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
        <h2 className="text-2xl font-bold">Powiązane Anime</h2>
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[160px] flex-none">
                <div className="aspect-[2/3] bg-muted rounded-lg" />
                <div className="h-[72px] bg-muted mt-2 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Powiązane Anime</h2>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
        >
          {relatedAnime.map((anime) => (
            <Link href={`/anime/${anime.node.id}`} key={anime.node.id}>
              <Card className="overflow-hidden h-full w-[160px] flex-none">
                <div className="aspect-[2/3] relative">
                  <Image
                    src={anime.node.coverImage.large}
                    alt={anime.node.title.english || anime.node.title.romaji}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2 flex flex-col justify-between h-[72px]">
                  <h3 className="font-medium text-sm line-clamp-2">
                    {anime.node.title.english || anime.node.title.romaji}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {getRelationLabel(anime.relationType)}
                  </p>
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