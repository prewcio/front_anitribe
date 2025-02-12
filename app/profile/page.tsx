import { Suspense } from "react"
import Image from "next/image"
import { getUserProfile } from "@/lib/api/laravel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoadingSpinner from "@/components/LoadingSpinner"
import AnimeGrid from "@/components/AnimeGrid"
import { Badge } from "@/components/ui/badge"
import { Play, Star, MessageSquare } from "lucide-react" // Import missing icons

async function ProfileContent() {
  const profile = await getUserProfile()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Card className="w-full md:w-1/3">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Image
                src={profile.avatar || "/placeholder-user.jpg"}
                alt={profile.username}
                width={120}
                height={120}
                className="rounded-full border-4 border-primary"
              />
              <h1 className="mt-4 text-2xl font-bold">{profile.username}</h1>
              <p className="text-sm text-muted-foreground">Joined: {new Date(profile.joinDate).toLocaleDateString()}</p>
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
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Watched Episodes</p>
                <p className="text-2xl font-bold">{profile.stats.watchedEpisodes}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold">{profile.stats.averageRating.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Favorite Genres</p>
                <p className="text-sm">{profile.stats.favoriteGenres.join(", ")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Watch Time</p>
                <p className="text-2xl font-bold">{profile.stats.watchTime} hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="watching" className="w-full">
        <TabsList>
          <TabsTrigger value="watching">Watching</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="planned">Plan to Watch</TabsTrigger>
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
          <CardTitle>Recent Activity</CardTitle>
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
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
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
      <Suspense fallback={<LoadingGrid />}>
        <ProfileContent />
      </Suspense>
    </div>
  )
}

