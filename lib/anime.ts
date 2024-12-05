import type { AnimeBase, AnimeDetailed, Character, AnimeSearchResult } from "@/types/anime"

export async function searchAnime(query: string): Promise<AnimeSearchResult[]> {
  // This would integrate with AniDB and AniList APIs
  // For now, returning mock data
  return [
    {
      id: 1,
      title: {
        english: "Sword Art Online",
        romaji: "Sōdo Āto Onrain",
        japanese: "ソードアート・オンライン",
      },
      type: "TV",
      image: "/placeholder.svg?height=200&width=150",
      score: 7.5,
      year: 2012,
    },
    // More results...
  ]
}

export async function getAnimeById(id: number): Promise<AnimeDetailed> {
  // This would fetch from AniDB using their ID system
  // For now, returning mock data
  return {
    id,
    title: {
      english: "Sword Art Online",
      romaji: "Sōdo Āto Onrain",
      japanese: "ソードアート・オンライン",
    },
    type: "TV",
    episodes: 25,
    status: "Finished Airing",
    season: "Summer 2012",
    releaseDate: "2012-07-07",
    image: "/placeholder.svg?height=400&width=300",
    description: "In the year 2022, virtual reality has progressed...",
    genres: ["Action", "Adventure", "Fantasy", "Romance"],
    duration: 23,
    score: 7.5,
    popularity: 500000,
    source: "Light Novel",
    studios: ["A-1 Pictures"],
  }
}

export async function getAnimeCharacters(animeId: number): Promise<Character[]> {
  // This would fetch from AniList API
  // For now, returning mock data
  return [
    {
      id: 1,
      name: {
        first: "Kirito",
        last: "Kirigaya",
        native: "桐ヶ谷 和人",
      },
      image: "/placeholder.svg?height=200&width=150",
      description: "The main protagonist of Sword Art Online...",
      role: "MAIN",
      animeId,
    },
    // More characters...
  ]
}

export async function getSimilarAnime(animeId: number): Promise<AnimeBase[]> {
  // This would fetch from AniList API recommendations
  // For now, returning mock data
  return [
    {
      id: 2,
      title: {
        english: "Log Horizon",
        romaji: "Log Horizon",
        japanese: "ログ・ホライズン",
      },
      type: "TV",
      episodes: 25,
      status: "Finished Airing",
      season: "Fall 2013",
      releaseDate: "2013-10-05",
      image: "/placeholder.svg?height=200&width=150",
    },
    // More similar anime...
  ]
}

