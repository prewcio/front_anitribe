export const mockAnimeData = [
  {
    id: 1,
    title: {
      english: "Attack on Titan",
      romaji: "Shingeki no Kyojin",
      native: "進撃の巨人",
    },
    coverImage: {
      large: "/placeholder.svg?height=300&width=200",
    },
    bannerImage: "/placeholder.svg?height=200&width=500",
    description:
      "Wiele lat temu ludzkość została zdziesiątkowana przez olbrzymie humanoidalne istoty zwane Tytanami...",
    genres: ["Akcja", "Ciemna fantastyka", "Dramat"],
    episodes: 25,
    status: "ZAKOŃCZONE",
    startDate: { year: 2013, month: 4, day: 7 },
    endDate: { year: 2013, month: 9, day: 29 },
    season: "WIOSNA",
    averageScore: 85,
    popularity: 500000,
    studios: { nodes: [{ name: "Wit Studio" }] },
    characters: {
      edges: [
        {
          node: {
            id: 1,
            name: { full: "Eren Yeager", native: "エレン・イェーガー" },
            image: { medium: "/placeholder.svg?height=150&width=100" },
          },
          role: "GŁÓWNA",
        },
        // Add more characters...
      ],
    },
    recommendations: {
      nodes: [
        {
          mediaRecommendation: {
            id: 2,
            title: { english: "Death Note", romaji: "Death Note" },
            coverImage: { medium: "/placeholder.svg?height=150&width=100" },
          },
        },
        // Add more recommendations...
      ],
    },
  },
  // Add more anime...
]

export const mockUserData = {
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

export const mockForumData = {
  categories: [
    {
      id: 1,
      name: "Ogólna dyskusja",
      threads: [
        {
          id: 1,
          title: "Wasze ulubione anime sezonu?",
          replyCount: 25,
          lastReplyDate: "2023-06-10T14:30:00Z",
        },
        // Add more threads...
      ],
    },
    {
      id: 2,
      name: "Recenzje i rekomendacje",
      threads: [
        {
          id: 2,
          title: "Attack on Titan - recenzja finałowego sezonu",
          replyCount: 50,
          lastReplyDate: "2023-06-09T18:45:00Z",
        },
        // Add more threads...
      ],
    },
    // Add more categories...
  ],
}

