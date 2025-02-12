"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import AnimeGrid from "@/components/AnimeGrid"
import { Play, Star, MessageSquare } from "lucide-react"
import { mockUserData } from "@/lib/mockData"
import { useAuth } from "@/lib/auth"

function ProfileContent() {
  const [profile, setProfile] = useState(mockUserData)
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    // In a real app, you would fetch the profile data here
    setProfile(mockUserData)
  }, [])

  if (!isAuthenticated) {
    return <div className="text-center">Zaloguj się, aby zobaczyć swój profil.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Card className="w-full md:w-1/3">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Image
                src={profile.avatar || "/placeholder.svg"}
                alt={profile.username}
                width={120}
                height={120}
                className="rounded-full border-4 border-primary"
              />
              <h1 className="mt-4 text-2xl font-bold">{profile.username}</h1>
              <p className="text-sm text-muted-foreground">
                Dołączył: {new Date(profile.joinDate).toLocaleDateString()}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {profile.badges.map((badge) => (
                  <Badge key={badge.id} variant="outline" className="text-xs">
                    {badge.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full md:w-2/3">
          <CardHeader>
            <CardTitle>Statystyki</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Obejrzane odcinki</p>
                <p className="text-2xl font-bold">{profile.stats.watchedEpisodes}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Średnia ocena</p>
                <p className="text-2xl font-bold">{profile.stats.averageRating.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ulubione gatunki</p>
                <p className="text-sm">{profile.stats.favoriteGenres.join(", ")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Czas oglądania</p>
                <p className="text-2xl font-bold">{profile.stats.watchTime} godzin</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="watching" className="w-full">
        <TabsList>
          <TabsTrigger value="watching">Oglądane</TabsTrigger>
          <TabsTrigger value="completed">Ukończone</TabsTrigger>
          <TabsTrigger value="planned">Planowane</TabsTrigger>
        </TabsList>
        <TabsContent value="watching">
          <AnimeGrid items={profile.watchingAnime} />
        </TabsContent>
        <TabsContent value="completed">
          <AnimeGrid items={profile.completedAnime} />
        </TabsContent>
        <TabsContent value="planned">
          <AnimeGrid items={profile.plannedAnime} />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Ostatnia aktywność</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {profile.recentActivity.map((activity, index) => (
              <li key={index} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  {activity.type === "watch" && <Play className="w-6 h-6" />}
                  {activity.type === "rate" && <Star className="w-6 h-6" />}
                  {activity.type === "comment" && <MessageSquare className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileContent />
    </div>
  )
}

