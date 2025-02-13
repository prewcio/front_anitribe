"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Bell, Megaphone, Wrench, Star } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { pl } from "date-fns/locale"

interface SystemNews {
  id: string
  type: "announcement" | "maintenance" | "update" | "event"
  title: string
  content: string
  timestamp: string
  priority: "low" | "medium" | "high"
}

export function SystemNewsFeed() {
  // Mock data - replace with actual API call
  const [news] = useState<SystemNews[]>([
    {
      id: "1",
      type: "announcement",
      title: "Witamy w AniTribe!",
      content: "Dziękujemy za dołączenie do naszej społeczności. Zapraszamy do odkrywania nowych anime i dzielenia się swoimi opiniami!",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "high"
    },
    {
      id: "2",
      type: "maintenance",
      title: "Planowane prace techniczne",
      content: "W nocy z 15 na 16 lutego w godzinach 2:00-4:00 wystąpią przerwy w działaniu serwisu ze względu na prace konserwacyjne.",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      priority: "medium"
    },
    {
      id: "3",
      type: "event",
      title: "Zimowy konkurs AMV",
      content: "Rozpoczynamy zimowy konkurs na najlepszy AMV! Zgłoszenia przyjmujemy do końca lutego. Główna nagroda: roczne członkostwo premium!",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      priority: "medium"
    }
  ])

  const getIcon = (type: SystemNews["type"]) => {
    switch (type) {
      case "announcement":
        return <Megaphone className="w-5 h-5" />
      case "maintenance":
        return <Wrench className="w-5 h-5" />
      case "update":
        return <Bell className="w-5 h-5" />
      case "event":
        return <Star className="w-5 h-5" />
    }
  }

  const getPriorityColor = (priority: SystemNews["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-500/10"
      case "medium":
        return "text-yellow-500 bg-yellow-500/10"
      case "low":
        return "text-blue-500 bg-blue-500/10"
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Aktualności</h2>
      <div className="grid gap-4">
        {news.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex gap-4">
              <div className={`p-2 rounded-lg ${getPriorityColor(item.priority)}`}>
                {getIcon(item.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{item.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(item.timestamp), {
                      addSuffix: true,
                      locale: pl
                    })}
                  </span>
                </div>
                <p className="text-muted-foreground">{item.content}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 