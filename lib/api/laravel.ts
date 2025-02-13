// Mock data for latest episodes
const mockLatestEpisodes = [
  {
    id: 1,
    animeId: 1,
    number: 1,
    title: "The Beginning",
    thumbnail: "https://example.com/thumbnail1.jpg",
    addedAt: new Date().toISOString(),
  },
  {
    id: 2,
    animeId: 2,
    number: 1,
    title: "A New Adventure",
    thumbnail: "https://example.com/thumbnail2.jpg",
    addedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  // Add more mock episodes as needed
]

export async function getLatestEpisodes() {
  // This is a mock implementation. In a real app, you'd fetch this data from your Laravel backend.
  return Promise.resolve(mockLatestEpisodes)
}

export async function getEpisodeData(animeId: number, episodeId: number) {
  // This is a mock implementation using the provided video URL
  return {
    id: episodeId,
    number: episodeId,
    title: `Episode ${episodeId}`,
    videoUrl: "https://cdn2.prewcio.dev/files/NeetEp4.mp4",
    thumbnail: "https://example.com/thumbnail.jpg",
    description: `This is the description for episode ${episodeId} of anime ${animeId}.`,
    sections: [
      { type: "OPENING" as const, start: 26, end: 86 },
      { type: "ENDING" as const, start: 1315, end: 1375 }, // Example ending at 21:55-22:55
    ],
  }
}

// Mock implementation for getAnimeData
export async function getAnimeData(animeId: number) {
  return {
    id: animeId,
    titles: {
      english: "Mock Anime Title",
      native: "モックアニメタイトル",
      romaji: "Mokku Anime Taitoru",
      polish: "Tytuł Przykładowego Anime",
    },
    episodes: 12,
    description: "This is a mock anime description.",
  }
}

// Add the getAnimeComments function
export async function getAnimeComments(animeId: number) {
  // This is a mock implementation. In a real app, you'd fetch this data from your Laravel backend.
  return Promise.resolve([
    {
      id: 1,
      user: {
        username: "AnimeWatcher",
        avatar: "/placeholder.svg",
      },
      content: "This anime is amazing!",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      user: {
        username: "OtakuFan",
        avatar: "/placeholder.svg",
      },
      content: "I can't wait for the next episode!",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    // Add more mock comments as needed
  ])
}

// Add the getAnimeEpisodes function
export async function getAnimeEpisodes(animeId: number) {
  // This is a mock implementation
  return Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    number: i + 1,
    title: `Liam po raz pierwszy próbował użyć... ${i + 1}`,
    thumbnail: "/placeholder.svg?height=180&width=320",
    languages: {
      dubbing: ["JP"],
      subtitles: ["EN", "PL"],
    },
    releaseDate: i > 7 ? new Date(Date.now() + (i - 7) * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
  }))
}

// Add the rateAnime function
export async function rateAnime(animeId: number, rating: number) {
  // This is a mock implementation. In a real app, you'd send this data to your Laravel backend.
  console.log(`Rating anime ${animeId} with ${rating} stars`)
  return Promise.resolve({ success: true })
}

export async function getAvailablePlayers(animeId: number, episodeId: number) {
  // This is a mock implementation. In a real app, you'd fetch this data from your Laravel backend.
  return [
    { id: "default", name: "Default Player", language: "Japanese" },
    { id: "alternative", name: "Alternative Player", language: "English" },
    { id: "custom", name: "Custom Player", language: "Polish" },
  ]
}

import { User, UserSettings, ActivityItem } from "@/lib/types/user"

export async function getUserProfile(): Promise<User> {
  // This is a mock implementation. Replace with actual API call
  return {
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
      watchTime: 48 * 24 + 12, // 48 days and 12 hours in hours
      averageRating: 8.5,
      favoriteGenres: ["Action", "Comedy", "Drama"],
      watching: 12,
      completed: 86,
      planned: 45
    },
    badges: [
      {
        id: "1",
        name: "Otaku Master",
        icon: "/badges/otaku.png",
        description: "Watched over 1000 episodes"
      },
      {
        id: "2",
        name: "Binge Watcher",
        icon: "/badges/binge.png",
        description: "Watched 12 episodes in one day"
      },
      {
        id: "3",
        name: "Anime Critic",
        icon: "/badges/critic.png",
        description: "Rated 100 anime"
      }
    ],
    friends: [
      {
        id: "2",
        username: "AnimeFan123",
        avatar: "/placeholder-user.jpg",
        status: "online",
        lastActive: new Date().toISOString()
      },
      {
        id: "3",
        username: "MangaReader",
        avatar: "/placeholder-user.jpg",
        status: "watching",
        lastActive: new Date().toISOString()
      },
      {
        id: "4",
        username: "WeebMaster",
        avatar: "/placeholder-user.jpg",
        status: "offline",
        lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      }
    ],
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
    watchingAnime: [
      {
        id: 1,
        title: {
          romaji: "One Piece",
          english: "One Piece",
          native: "ワンピース"
        },
        coverImage: {
          large: "/anime/one-piece.jpg"
        },
        averageScore: 92,
        episodes: 1000,
        format: "TV",
        progress: 950
      }
    ],
    completedAnime: [
      {
        id: 2,
        title: {
          romaji: "Death Note",
          english: "Death Note",
          native: "デスノート"
        },
        coverImage: {
          large: "/anime/death-note.jpg"
        },
        averageScore: 95,
        episodes: 37,
        format: "TV",
        progress: 37
      }
    ],
    plannedAnime: [
      {
        id: 3,
        title: {
          romaji: "Shingeki no Kyojin",
          english: "Attack on Titan",
          native: "進撃の巨人"
        },
        coverImage: {
          large: "/anime/aot.jpg"
        },
        averageScore: 90,
        episodes: 75,
        format: "TV",
        progress: 0
      }
    ],
    recentActivity: [
      {
        id: "1",
        type: "watch",
        userId: "1",
        username: "AnimeUser",
        userAvatar: "/placeholder-user.jpg",
        content: "Watched episode 950 of One Piece",
        timestamp: new Date().toISOString(),
        metadata: {
          animeId: "1",
          animeName: "One Piece",
          episodeNumber: 950
        }
      },
      {
        id: "2",
        type: "rate",
        userId: "1",
        username: "AnimeUser",
        userAvatar: "/placeholder-user.jpg",
        content: "Rated Death Note 9.5/10",
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        metadata: {
          animeId: "2",
          animeName: "Death Note",
          rating: 9.5
        }
      }
    ]
  }
}

export async function updateUserSettings(settings: UserSettings): Promise<void> {
  // This is a mock implementation. Replace with actual API call
  console.log("Updating user settings:", settings)
}

const mockForumCategories = [
  {
    id: 1,
    name: "Ogólne Dyskusje Anime",
    threads: [
      {
        id: 1,
        title: "Ulubione anime 2024",
        replyCount: 45,
        lastReplyDate: "2024-12-05T14:30:00Z"
      },
      {
        id: 2,
        title: "Nowe sezony zapowiedziane",
        replyCount: 32,
        lastReplyDate: "2024-12-04T18:45:00Z"
      }
    ]
  },
  {
    id: 2,
    name: "Recenzje i Oceny",
    threads: [
      {
        id: 3,
        title: "Najlepsze anime wszech czasów?",
        replyCount: 89,
        lastReplyDate: "2024-12-06T10:15:00Z"
      }
    ]
  }
]

export async function getForumCategories() {
  return Promise.resolve(mockForumCategories)
}

