"use client"

import { User } from "@/lib/types/user"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserPlus, MessageSquare, Crown } from "lucide-react"

interface ProfileHeaderProps {
  user: User
  isOwnProfile: boolean
  onAddFriend?: () => void
  onMessage?: () => void
}

export function ProfileHeader({ user, isOwnProfile, onAddFriend, onMessage }: ProfileHeaderProps) {
  const avatarWrapperStyle = user.isDonator && user.customization.avatarBorder ? {
    background: `url(${user.customization.avatarBorder}) no-repeat center/cover`
  } : {}

  const nicknameStyle = user.isDonator && user.customization.nicknameColor ? {
    color: user.customization.nicknameColor
  } : {}

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            {/* Avatar wrapper with potential animated border for donators */}
            <div 
              className="w-32 h-32 rounded-full p-1"
              style={avatarWrapperStyle}
            >
              {user.isDonator && user.customization.avatarAnimation ? (
                // Animated avatar for donators
                <div className="w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={user.avatar}
                    alt={user.username}
                    width={120}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                // Static avatar for regular users
                <Image
                  src={user.avatar}
                  alt={user.username}
                  width={120}
                  height={120}
                  className="rounded-full"
                />
              )}
            </div>
            
            {/* Donator badge */}
            {user.isDonator && (
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600">
                  <Crown className="w-4 h-4 mr-1" />
                  Donator
                </Badge>
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h1 
                className="text-2xl font-bold"
                style={nicknameStyle}
              >
                {user.username}
              </h1>
              {user.badges.map((badge) => (
                <Badge key={badge.id} variant="outline" className="text-xs">
                  {badge.name}
                </Badge>
              ))}
            </div>

            <p className="text-sm text-muted-foreground mt-1">
              Joined {new Date(user.joinDate).toLocaleDateString()}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center md:text-left">
              <div>
                <p className="text-2xl font-bold">{user.stats.watching}</p>
                <p className="text-sm text-muted-foreground">Watching</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{user.stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{user.friends.length}</p>
                <p className="text-sm text-muted-foreground">Friends</p>
              </div>
            </div>

            {!isOwnProfile && (
              <div className="mt-6 flex gap-2 justify-center md:justify-start">
                <Button onClick={onAddFriend}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Friend
                </Button>
                <Button variant="outline" onClick={onMessage}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 