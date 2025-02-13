import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserProfile } from "@/lib/api/laravel"
import LoadingSpinner from "@/components/LoadingSpinner"
import { ProfileHeaderWrapper } from "@/components/profile/ProfileHeaderWrapper"
import { ActivityFeed } from "@/components/profile/ActivityFeed"
import { ProfileSettingsWrapper } from "@/components/profile/ProfileSettingsWrapper"
import AnimeGrid from "@/components/AnimeGrid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function ProfileContent() {
  const profile = await getUserProfile()
  const isOwnProfile = true // To powinno być określone przez porównanie profile.id z ID zalogowanego użytkownika

  return (
    <div className="space-y-6">
      <ProfileHeaderWrapper 
        user={profile}
        isOwnProfile={isOwnProfile}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="activity">Aktywność</TabsTrigger>
              <TabsTrigger value="anime">Lista Anime</TabsTrigger>
              {isOwnProfile && <TabsTrigger value="settings">Ustawienia</TabsTrigger>}
            </TabsList>

            <TabsContent value="activity">
              <ActivityFeed activities={profile.recentActivity} />
            </TabsContent>

            <TabsContent value="anime">
              <Card>
                <CardHeader>
                  <CardTitle>Moja Lista Anime</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="watching" className="w-full">
                    <TabsList>
                      <TabsTrigger value="watching">Oglądam ({profile.stats.watching})</TabsTrigger>
                      <TabsTrigger value="completed">Ukończone ({profile.stats.completed})</TabsTrigger>
                      <TabsTrigger value="planned">Planuję ({profile.stats.planned})</TabsTrigger>
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
                </CardContent>
              </Card>
            </TabsContent>

            {isOwnProfile && (
              <TabsContent value="settings">
                <ProfileSettingsWrapper user={profile} />
              </TabsContent>
            )}
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Znajomi ({profile.friends.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.friends.map((friend) => (
                  <div key={friend.id} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      friend.status === 'online' ? 'bg-green-500' :
                      friend.status === 'watching' ? 'bg-purple-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{friend.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {friend.status === 'watching' ? 'Ogląda anime' :
                         friend.status === 'online' ? 'Online' : 'Ostatnio widziany ' + friend.lastActive}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Osiągnięcia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {profile.badges.map((badge) => (
                  <div 
                    key={badge.id}
                    className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-accent cursor-help"
                    title={badge.description}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <img src={badge.icon} alt={badge.name} className="w-8 h-8" />
                    </div>
                    <p className="text-xs font-medium">{badge.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <ProfileContent />
      </Suspense>
    </div>
  )
}

