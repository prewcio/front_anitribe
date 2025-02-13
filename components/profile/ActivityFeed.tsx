import { ActivityItem } from "@/lib/types/user"
import { formatDistanceToNow } from "date-fns"
import { Play, Star, MessageSquare, Users, Trophy, Heart, Pencil } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface ActivityFeedProps {
  activities: ActivityItem[]
}

const getActivityIcon = (type: ActivityItem["type"]) => {
  switch (type) {
    case "watch":
      return <Play className="w-4 h-4" />
    case "rate":
      return <Star className="w-4 h-4" />
    case "comment":
      return <MessageSquare className="w-4 h-4" />
    case "friend":
      return <Users className="w-4 h-4" />
    case "achievement":
      return <Trophy className="w-4 h-4" />
    case "status":
      return <Heart className="w-4 h-4" />
    case "post":
      return <Pencil className="w-4 h-4" />
    default:
      return null
  }
}

const getActivityColor = (type: ActivityItem["type"]) => {
  switch (type) {
    case "watch":
      return "bg-blue-500"
    case "rate":
      return "bg-yellow-500"
    case "comment":
      return "bg-green-500"
    case "friend":
      return "bg-purple-500"
    case "achievement":
      return "bg-orange-500"
    case "status":
      return "bg-pink-500"
    case "post":
      return "bg-indigo-500"
    default:
      return "bg-gray-500"
  }
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-4 items-start">
              <Avatar className="w-10 h-10">
                <AvatarImage src={activity.userAvatar} />
                <AvatarFallback>{activity.username[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Link href={`/profile/${activity.userId}`} className="font-medium hover:underline">
                    {activity.username}
                  </Link>
                  <span className={`p-1 rounded-full ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground">{activity.content}</p>
                
                {activity.metadata?.animeId && (
                  <Link 
                    href={`/anime/${activity.metadata.animeId}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {activity.metadata.animeName}
                  </Link>
                )}
                
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 