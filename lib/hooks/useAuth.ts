"use client"

import { useState, useEffect } from "react"
import { User } from "@/lib/types/user"

interface AuthState {
  isAuthenticated: boolean
  user: User | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null
  })

  const login = async (username: string, password: string) => {
    try {
      // Mock login - replace with actual API call
      const mockUser: User = {
        id: "1",
        username: "AnimeUser",
        email: "user@example.com",
        avatar: "/placeholder-user.jpg",
        level: 42,
        xp: 3240,
        joinDate: new Date().toISOString(),
        isDonator: true,
        customization: {
          nicknameColor: "#ff00ff",
          avatarBorder: "/borders/border1.gif",
          avatarAnimation: "pulse"
        },
        stats: {
          watchedEpisodes: 1432,
          watchTime: 48 * 24 + 12,
          averageRating: 8.5,
          favoriteGenres: ["Action", "Comedy", "Drama"],
          watching: 12,
          completed: 86,
          planned: 45
        },
        badges: [],
        friends: [],
        settings: {
          privacy: {
            profileVisibility: "public",
            activityFeedVisibility: "friends",
            showWatchStatus: true,
            showOnlineStatus: true
          },
          notifications: {
            friendRequests: true,
            messages: true,
            activityUpdates: true,
            animeUpdates: true
          },
          theme: {
            prefersDark: true,
            accentColor: "#7c3aed"
          },
          customization: {
            avatarAnimation: "pulse",
            nicknameColor: "#ff00ff",
            avatarBorder: "/borders/border1.gif"
          }
        },
        watchingAnime: [],
        completedAnime: [],
        plannedAnime: [],
        recentActivity: []
      }

      setState({
        isAuthenticated: true,
        user: mockUser
      })

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    setState({
      isAuthenticated: false,
      user: null
    })
  }

  return {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    login,
    logout
  }
} 