import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface UserProgressProps {
  className?: string
}

export function UserProgress({ className }: UserProgressProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span>Level 42</span>
            <span>3,240 / 4,000 XP</span>
          </div>
          <Progress value={81} className="h-2" indicatorClassName="bg-accent-primary" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-text-secondary">Watching</p>
            <p className="font-medium">12 Anime</p>
          </div>
          <div>
            <p className="text-text-secondary">Completed</p>
            <p className="font-medium">86 Anime</p>
          </div>
          <div>
            <p className="text-text-secondary">Total Episodes</p>
            <p className="font-medium">1,432</p>
          </div>
          <div>
            <p className="text-text-secondary">Watch Time</p>
            <p className="font-medium">48d 12h</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Recent Achievements</p>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-achievement-gold text-background-primary">
              🏆 Otaku Master
            </Badge>
            <Badge variant="outline" className="bg-achievement-silver text-background-primary">
              🎯 Binge Watcher
            </Badge>
            <Badge variant="outline" className="bg-achievement-bronze text-background-primary">
              ⭐ Anime Critic
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

