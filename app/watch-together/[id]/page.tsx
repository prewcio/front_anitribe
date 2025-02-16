"use client"

import { useState, useEffect } from "react"
import { VideoPlayer } from "@/components/VideoPlayer/VideoPlayer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { getAnimeEpisodeThumbnails } from "@/lib/api/anilist"
import { 
  Users, Send, Play, Pause, SkipForward, ChevronLeft, ChevronRight,
  Settings, Lock, Shield, UserPlus, UserMinus, Plus
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Message {
  id: string
  user: {
    name: string
    avatar: string
  }
  content: string
  timestamp: string
}

interface Props {
  params: { id: string }
  searchParams: { 
    animeId?: string
    episode?: string
    tab?: string 
  }
}

interface RoomSettings {
  isPrivate: boolean
  password?: string
  permissions: {
    playPause: boolean
    seek: boolean
    skip: boolean
    addToQueue: boolean
    removeFromQueue: boolean
    chat: boolean
    kick: boolean
  }
}

export default function WatchTogetherRoom({ params, searchParams }: Props) {
  const [message, setMessage] = useState("")
  const [settings, setSettings] = useState<RoomSettings>({
    isPrivate: false,
    permissions: {
      playPause: true,
      seek: true,
      skip: true,
      addToQueue: true,
      removeFromQueue: true,
      chat: true,
      kick: false
    }
  })
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      user: {
        name: "AnimeKing",
        avatar: "/placeholder-user.jpg"
      },
      content: "Zaczynamy maraton!",
      timestamp: new Date().toISOString()
    },
    {
      id: "2",
      user: {
        name: "OtakuMaster",
        avatar: "/placeholder-user.jpg"
      },
      content: "Ten odcinek jest niesamowity!",
      timestamp: new Date().toISOString()
    }
  ])
  const [episodeThumbnails, setEpisodeThumbnails] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const viewers = [
    { name: "AnimeKing", avatar: "/placeholder-user.jpg", isHost: true },
    { name: "OtakuMaster", avatar: "/placeholder-user.jpg", isHost: false },
    { name: "WeebLord", avatar: "/placeholder-user.jpg", isHost: false }
  ]

  // Mock episode data
  const episode = {
    id: 1,
    number: 1,
    title: "The Beginning",
    videoUrl: "https://cdn2.prewcio.dev/files/NeetEp4.mp4",
    thumbnail: "/placeholder.svg",
    sections: [
      { type: "OPENING", start: 26, end: 86 },
      { type: "ENDING", start: 1315, end: 1375 }
    ]
  }

  const episodes = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    number: i + 1,
    title: `Odcinek ${i + 1}`,
    thumbnail: "/placeholder.svg"
  }))

  const characters = [
    {
      id: 1,
      name: "Stella Vermillion",
      image: "/characters/stella.jpg",
      role: "Główna"
    },
    {
      id: 2,
      name: "Ikki Kurogane",
      image: "/characters/ikki.jpg",
      role: "Główna"
    }
  ]

  const animeId = searchParams.animeId ? parseInt(searchParams.animeId, 10) : 1
  const episodeNumber = searchParams.episode ? parseInt(searchParams.episode, 10) : 1

  useEffect(() => {
    async function fetchEpisodeThumbnails() {
      try {
        const thumbnails = await getAnimeEpisodeThumbnails(animeId)
        setEpisodeThumbnails(thumbnails)
      } catch (error) {
        console.error("Error fetching episode thumbnails:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEpisodeThumbnails()
  }, [animeId])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        user: {
          name: "Ty",
          avatar: "/placeholder-user.jpg"
        },
        content: message,
        timestamp: new Date().toISOString()
      }
    ])
    setMessage("")
  }

  const currentTab = searchParams.tab || "chat"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <Link href={`/anime/${animeId}`} className="text-sm text-muted-foreground hover:text-foreground">
              ← Wróć do strony anime
            </Link>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{viewers.length} widzów</span>
            </div>
          </div>

          <VideoPlayer
            src={episode.videoUrl}
            poster={episode.thumbnail}
            sections={episode.sections.map((section) => ({
              name: section.type,
              start: section.start,
              end: section.end,
              color: section.type === "OPENING" ? "#ef4444" : "#3b82f6",
            }))}
            animeId={animeId}
            episodeId={episodeNumber}
          />

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              disabled={episodeNumber === 1}
              asChild
            >
              <Link href={`/watch-together/${params.id}?animeId=${animeId}&episode=${episodeNumber - 1}`}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Poprzedni odcinek
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Play className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              disabled={episodeNumber === episodes.length}
              asChild
            >
              <Link href={`/watch-together/${params.id}?animeId=${animeId}&episode=${episodeNumber + 1}`}>
                Następny odcinek
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full">
            <Tabs value={currentTab} defaultValue="chat" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="chat" asChild className="flex-1">
                  <Link href={`/watch-together/${params.id}?animeId=${animeId}&episode=${episodeNumber}&tab=chat`}>
                    Czat
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="episodes" asChild className="flex-1">
                  <Link href={`/watch-together/${params.id}?animeId=${animeId}&episode=${episodeNumber}&tab=episodes`}>
                    Odcinki
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="viewers" asChild className="flex-1">
                  <Link href={`/watch-together/${params.id}?animeId=${animeId}&episode=${episodeNumber}&tab=viewers`}>
                    Widzowie
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="settings" asChild className="flex-1">
                  <Link href={`/watch-together/${params.id}?animeId=${animeId}&episode=${episodeNumber}&tab=settings`}>
                    <Settings className="w-4 h-4" />
                  </Link>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="flex-1 flex flex-col data-[state=inactive]:hidden">
                <ScrollArea className="flex-1">
                  <div className="space-y-4 p-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={msg.user.avatar} />
                          <AvatarFallback>{msg.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{msg.user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t mt-auto">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Napisz wiadomość..."
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="episodes" className="flex-1 data-[state=inactive]:hidden">
                <ScrollArea className="h-full">
                  <div className="grid grid-cols-1 gap-2 p-2">
                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Dodaj do kolejki
                    </Button>
                    <div className="space-y-2">
                      {episodeThumbnails.map((ep, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50"
                        >
                          <div className="relative aspect-video w-32">
                            <Image
                              src={ep.thumbnail || "/placeholder.svg"}
                              alt={ep.title || `Odcinek ${index + 1}`}
                              fill
                              className="rounded object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {ep.title || `Odcinek ${index + 1}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Odcinek {index + 1}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="viewers" className="flex-1 data-[state=inactive]:hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-2 p-2">
                    {viewers.map((viewer) => (
                      <div key={viewer.name} className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={viewer.avatar} />
                          <AvatarFallback>{viewer.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {viewer.name}
                            {viewer.isHost && (
                              <span className="text-xs text-purple-500 ml-1">
                                (Host)
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="settings" className="flex-1 data-[state=inactive]:hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-4 p-2">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Pokój Prywatny</Label>
                          <p className="text-xs text-muted-foreground">
                            Tylko zaproszeni użytkownicy mogą dołączyć
                          </p>
                        </div>
                        <Switch
                          checked={settings.isPrivate}
                          onCheckedChange={(checked) => 
                            setSettings(prev => ({ ...prev, isPrivate: checked }))
                          }
                        />
                      </div>

                      {settings.isPrivate && (
                        <div className="space-y-2">
                          <Label>Hasło (opcjonalne)</Label>
                          <Input
                            type="password"
                            value={settings.password}
                            onChange={(e) => 
                              setSettings(prev => ({ ...prev, password: e.target.value }))
                            }
                            placeholder="Wprowadź hasło..."
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Uprawnienia</h3>
                      <div className="space-y-2">
                        {[
                          { key: "playPause", label: "Odtwarzanie/Pauza", icon: Play },
                          { key: "seek", label: "Przewijanie", icon: ChevronRight },
                          { key: "skip", label: "Pomijanie", icon: SkipForward },
                          { key: "addToQueue", label: "Dodawanie do kolejki", icon: Plus },
                          { key: "removeFromQueue", label: "Usuwanie z kolejki", icon: UserMinus },
                          { key: "chat", label: "Czat", icon: Send },
                          { key: "kick", label: "Wyrzucanie użytkowników", icon: UserMinus }
                        ].map(({ key, label, icon: Icon }) => (
                          <div key={key} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              <Label>{label}</Label>
                            </div>
                            <Switch
                              checked={settings.permissions[key as keyof typeof settings.permissions]}
                              onCheckedChange={(checked) => 
                                setSettings(prev => ({
                                  ...prev,
                                  permissions: {
                                    ...prev.permissions,
                                    [key]: checked
                                  }
                                }))
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
} 