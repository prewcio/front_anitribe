"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth"

// This is mock data. In a real app, you would fetch this from your backend.
const mockAchievements = [
  {
    id: 1,
    title: "Początkujący Otaku",
    description: "Obejrzyj swoje pierwsze anime",
    progress: 100,
    total: 100,
    completed: true,
  },
  {
    id: 2,
    title: "Maratończyk",
    description: "Obejrzyj 10 odcinków pod rząd",
    progress: 7,
    total: 10,
    completed: false,
  },
  {
    id: 3,
    title: "Koneser Gatunków",
    description: "Obejrzyj anime z 5 różnych gatunków",
    progress: 3,
    total: 5,
    completed: false,
  },
  {
    id: 4,
    title: "Wierny Fan",
    description: "Obejrzyj wszystkie sezony jednego anime",
    progress: 2,
    total: 4,
    completed: false,
  },
]

export default function AchievementsPage() {
  const { isAuthenticated } = useAuth()
  const [achievements] = useState(mockAchievements)

  if (!isAuthenticated) {
    return <div className="text-center py-8">Zaloguj się, aby zobaczyć swoje osiągnięcia.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Moje Osiągnięcia</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className={achievement.completed ? "border-accent-success" : ""}>
            <CardHeader>
              <CardTitle>{achievement.title}</CardTitle>
              <CardDescription>{achievement.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={(achievement.progress / achievement.total) * 100} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                Postęp: {achievement.progress} / {achievement.total}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

