"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AnimeGrid from "@/components/AnimeGrid"
import { useAuth } from "@/lib/auth"

// This is mock data. In a real app, you would fetch this from your backend.
const mockWatchingAnime = [
  { id: 1, title: "Attack on Titan", image: "/placeholder.svg?height=150&width=100", progress: 15, totalEpisodes: 25 },
  { id: 2, title: "My Hero Academia", image: "/placeholder.svg?height=150&width=100", progress: 10, totalEpisodes: 25 },
]

const mockCompletedAnime = [
  { id: 3, title: "Death Note", image: "/placeholder.svg?height=150&width=100", rating: 9 },
  { id: 4, title: "Fullmetal Alchemist: Brotherhood", image: "/placeholder.svg?height=150&width=100", rating: 10 },
]

const mockPlannedAnime = [
  { id: 5, title: "One Piece", image: "/placeholder.svg?height=150&width=100" },
  { id: 6, title: "Demon Slayer", image: "/placeholder.svg?height=150&width=100" },
]

export default function MyListPage() {
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState("watching")

  if (!isAuthenticated) {
    return <div className="text-center py-8">Zaloguj się, aby zobaczyć swoją listę anime.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Moja Lista Anime</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="watching">Oglądane</TabsTrigger>
          <TabsTrigger value="completed">Ukończone</TabsTrigger>
          <TabsTrigger value="planned">Planowane</TabsTrigger>
        </TabsList>
        <TabsContent value="watching">
          <AnimeGrid items={mockWatchingAnime} />
        </TabsContent>
        <TabsContent value="completed">
          <AnimeGrid items={mockCompletedAnime} />
        </TabsContent>
        <TabsContent value="planned">
          <AnimeGrid items={mockPlannedAnime} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

