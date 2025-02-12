"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

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

interface AnimeRecommendation {
  id: number
  title: {
    romaji: string
    english: string | null
  }
  coverImage: {
    medium: string
  }
}

interface AnimeInfoTabsProps {
  characters: CharacterData[]
  recommendations: AnimeRecommendation[]
}

export function AnimeInfoTabs({ characters, recommendations }: AnimeInfoTabsProps) {
  const [activeTab, setActiveTab] = useState("characters")
  const [currentPage, setCurrentPage] = useState(1)
  const [tabTransition, setTabTransition] = useState(false)
  const itemsPerPage = 5

  const activeItems = activeTab === "characters" ? characters : recommendations
  const totalPages = Math.ceil(activeItems.length / itemsPerPage)

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const renderItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const items = activeItems.slice(startIndex, endIndex)

    return items.map((item) => (
      <Link href={activeTab === "characters" ? `/character/${item.node.id}` : `/anime/${item.id}`} key={item.id}>
        <Card className="flex items-center p-2 hover:bg-accent transition-colors">
          <img
            src={activeTab === "characters" ? item.node.image.medium : item.coverImage.medium}
            alt={activeTab === "characters" ? item.node.name.full : item.title.english || item.title.romaji}
            className="w-12 h-16 object-cover mr-3"
          />
          <div>
            <p className="font-medium text-sm">
              {activeTab === "characters" ? item.node.name.full : item.title.english || item.title.romaji}
            </p>
            {activeTab === "characters" && (
              <p className="text-xs text-muted-foreground">{item.role === "MAIN" ? "Główna" : "Drugoplanowa"}</p>
            )}
          </div>
        </Card>
      </Link>
    ))
  }

  return (
    <Tabs
      defaultValue="characters"
      className="w-full"
      onValueChange={(value) => {
        setTabTransition(true)
        setTimeout(() => {
          setActiveTab(value)
          setCurrentPage(1)
          setTabTransition(false)
        }, 300)
      }}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="characters" className="transition-colors duration-300 ease-in-out">
          Postacie
        </TabsTrigger>
        <TabsTrigger value="similar" className="transition-colors duration-300 ease-in-out">
          Podobne Anime
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="characters"
        className={cn(
          "space-y-4 transition-all duration-300 ease-in-out",
          tabTransition && "opacity-0 transform translate-x-4",
        )}
      >
        {renderItems()}
      </TabsContent>
      <TabsContent
        value="similar"
        className={cn(
          "space-y-4 transition-all duration-300 ease-in-out",
          tabTransition && "opacity-0 transform translate-x-4",
        )}
      >
        {renderItems()}
      </TabsContent>
      <div className="flex justify-between mt-4">
        <Button onClick={prevPage} disabled={currentPage === 1} variant="outline" size="sm">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Poprzednia
        </Button>
        <span className="text-sm">
          Strona {currentPage} z {totalPages}
        </span>
        <Button onClick={nextPage} disabled={currentPage === totalPages} variant="outline" size="sm">
          Następna
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Tabs>
  )
}

