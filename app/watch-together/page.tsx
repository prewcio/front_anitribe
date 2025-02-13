"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Users, Play, Plus, X } from "lucide-react"
import Link from "next/link"

interface QueueItem {
  id: string
  title: string
  episode: number
  duration: number
}

export default function WatchTogetherPage() {
  const [roomName, setRoomName] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [queue, setQueue] = useState<QueueItem[]>([
    {
      id: "1",
      title: "One Piece",
      episode: 1045,
      duration: 24
    },
    {
      id: "2",
      title: "Jujutsu Kaisen",
      episode: 12,
      duration: 24
    }
  ])

  const activeRooms = [
    {
      id: "1",
      name: "Oglądamy One Piece!",
      host: "AnimeKing",
      viewers: 5,
      currentAnime: "One Piece",
      episode: 1045
    },
    {
      id: "2",
      name: "Maraton JJK",
      host: "OtakuMaster",
      viewers: 3,
      currentAnime: "Jujutsu Kaisen",
      episode: 12
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Oglądaj Razem</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Stwórz Pokój
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aktywne Pokoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeRooms.map((room) => (
                <Card key={room.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{room.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Host: {room.host}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Oglądają: {room.currentAnime} - Odcinek {room.episode}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span className="text-sm">{room.viewers}</span>
                        </div>
                        <Button asChild>
                          <Link href={`/watch-together/${room.id}`}>
                            Dołącz
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stwórz Nowy Pokój</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="room-name">Nazwa Pokoju</Label>
                <Input
                  id="room-name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="np. Maraton One Piece"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="private-room">Pokój Prywatny</Label>
                <Switch
                  id="private-room"
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                />
              </div>

              <div>
                <Label>Kolejka Odcinków</Label>
                <div className="mt-2 space-y-2">
                  {queue.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 bg-accent/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Odcinek {item.episode} • {item.duration} min
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Dodaj do Kolejki
                  </Button>
                </div>
              </div>

              <Button className="w-full">Stwórz Pokój</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 