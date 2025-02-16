"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Plus } from "lucide-react"
import { getFeaturedAnime } from "@/lib/api/hybrid"
import { formatDescription } from "@/lib/utils/formatDescription"

interface FeaturedAnime {
  id: number
  title: {
    romaji: string
    english: string
    native: string
  }
  bannerImage: string
  coverImage: {
    large: string
  }
  description: string
  genres: string[]
  averageScore: number
  nextAiringEpisode?: {
    episode: number
    timeUntilAiring: number
  }
}

export function HeroAnime() {
  const [mounted, setMounted] = useState(false)
  const [featuredAnime, setFeaturedAnime] = useState<FeaturedAnime | null>(null)
  const [formattedDescription, setFormattedDescription] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getFeaturedAnime()
        setFeaturedAnime(data)
      } catch (error) {
        console.error("Error fetching featured anime:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function formatDesc() {
      if (featuredAnime?.description) {
        const formatted = await formatDescription(featuredAnime.description)
        setFormattedDescription(formatted)
      }
    }
    formatDesc()
  }, [featuredAnime?.description])

  if (!mounted || isLoading || !featuredAnime) {
    return (
      <div className="w-full h-[400px] md:h-[600px] bg-accent animate-pulse" />
    )
  }

  const formatTimeUntilAiring = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600))
    const hours = Math.floor((seconds % (24 * 3600)) / 3600)
    
    if (days > 0) {
      return `${days} dni ${hours} godz`
    }
    return `${hours} godz`
  }

  return (
    <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden">
      {featuredAnime.bannerImage ? (
        <Image
          src={featuredAnime.bannerImage}
          alt={featuredAnime.title.english || featuredAnime.title.romaji}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      
      <div className="relative h-full container mx-auto px-4">
        <div className="absolute bottom-4 md:bottom-8 left-0 right-0">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <Card className="hidden md:block w-[220px] overflow-hidden shrink-0 h-fit">
              <div className="aspect-[2/3] relative">
                <Image
                  src={featuredAnime.coverImage.large}
                  alt={featuredAnime.title.english || featuredAnime.title.romaji}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
            
            <div className="flex-1 space-y-2 md:space-y-4 max-w-full">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold break-words">
                  {featuredAnime.title.english || featuredAnime.title.romaji}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mt-1 break-words">
                  {featuredAnime.title.native}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {featuredAnime.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-2 py-1 rounded-full bg-accent text-xs md:text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              {mounted && formattedDescription && (
                <div 
                  className="text-base md:text-lg text-muted-foreground line-clamp-2 md:line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: formattedDescription }}
                />
              )}
              
              <div className="flex items-center gap-4 flex-wrap">
                <Button asChild size="lg" className="h-9 md:h-11">
                  <Link href={`/anime/${featuredAnime.id}`}>
                    <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Rozpocznij oglądanie
                  </Link>
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 md:h-11 md:w-11">
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
                {featuredAnime.nextAiringEpisode && (
                  <div className="hidden md:block ml-auto text-right">
                    <p className="text-sm text-muted-foreground">Następny odcinek</p>
                    <p className="text-lg font-semibold">
                      Odcinek {featuredAnime.nextAiringEpisode.episode} za{" "}
                      {formatTimeUntilAiring(featuredAnime.nextAiringEpisode.timeUntilAiring)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 