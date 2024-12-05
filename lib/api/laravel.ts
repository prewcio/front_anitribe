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

export async function getUserProfile() {
  // This is a mock implementation. In a real app, you'd fetch this data from your Laravel backend.
  return {
    username: "AnimeWielbiciel",
    avatar: "/placeholder-user.jpg",
    joinDate: "2022-01-01",
    badges: [
      { id: 1, name: "Początkujący Otaku" },
      { id: 2, name: "Maratończyk Anime" },
    ],
    stats: {
      watchedEpisodes: 500,
      averageRating: 8.5,
      favoriteGenres: ["Akcja", "Romans", "Komedia"],
      watchTime: 1000,
    },
    watchingAnime: [
      {
        id: 1,
        title: "Attack on Titan",
        image: "/placeholder.svg?height=150&width=100",
        progress: 15,
        totalEpisodes: 25,
      },
      // Add more watching anime...
    ],
    completedAnime: [
      { id: 2, title: "Death Note", image: "/placeholder.svg?height=150&width=100", rating: 9 },
      // Add more completed anime...
    ],
    plannedAnime: [
      { id: 3, title: "One Piece", image: "/placeholder.svg?height=150&width=100" },
      // Add more planned anime...
    ],
    recentActivity: [
      { type: "watch", description: "Obejrzał odcinek 15 Attack on Titan", timestamp: "2023-06-10T14:30:00Z" },
      { type: "rate", description: "Ocenił Death Note na 9/10", timestamp: "2023-06-09T18:45:00Z" },
      { type: "comment", description: "Skomentował One Piece", timestamp: "2023-06-08T10:15:00Z" },
    ],
  }
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

