import { getAnimeDetails } from "../api/anilist"

export interface CombinedAnimeData {
  id: number
  titles: {
    english: string | null
    native: string
    romaji: string
    polish: string // We'll use english or romaji as fallback
  }
  type: string
  episodes: number | null
  status: string
  description: string
  genres: string[]
  score: number
  characters: Array<{
    id: number
    name: {
      full: string
      native: string
    }
    image: string
    role: string
  }>
}

const STATUS_MAP: Record<string, string> = {
  FINISHED: "Zakończone",
  RELEASING: "Emitowane",
  NOT_YET_RELEASED: "Nadchodzące",
  CANCELLED: "Anulowane",
  HIATUS: "Wstrzymane",
}

const TYPE_MAP: Record<string, string> = {
  TV: "Serial TV",
  MOVIE: "Film",
  OVA: "OVA",
  ONA: "ONA",
  SPECIAL: "Odcinek specjalny",
  MUSIC: "Teledysk",
  TV_SHORT: "Krótki serial",
}

export async function getAnimeData(id: number): Promise<CombinedAnimeData> {
  const anilistData = await getAnimeDetails(id)

  return {
    id,
    titles: {
      english: anilistData.title.english,
      native: anilistData.title.native,
      romaji: anilistData.title.romaji,
      polish: anilistData.title.english || anilistData.title.romaji, // Using English as Polish until proper translation is available
    },
    type: TYPE_MAP[anilistData.type] || anilistData.type,
    episodes: anilistData.episodes,
    status: STATUS_MAP[anilistData.status] || anilistData.status,
    description: anilistData.description,
    genres: anilistData.genres,
    score: anilistData.averageScore ? anilistData.averageScore / 10 : 0,
    characters:
      anilistData.characters?.edges.map((edge) => ({
        id: edge.node.id,
        name: {
          full: edge.node.name.full,
          native: edge.node.name.native,
        },
        image: edge.node.image.medium,
        role: edge.role,
      })) || [],
  }
}

export const POLISH_GENRES = {
  Action: "Akcja",
  Adventure: "Przygodowe",
  Comedy: "Komedia",
  Drama: "Dramat",
  Fantasy: "Fantastyka",
  Horror: "Horror",
  Mecha: "Mecha",
  Music: "Muzyczne",
  Mystery: "Tajemnica",
  Psychological: "Psychologiczne",
  Romance: "Romans",
  "Sci-Fi": "Sci-Fi",
  "Slice of Life": "Okruchy życia",
  Sports: "Sport",
  Supernatural: "Nadprzyrodzone",
  Thriller: "Thriller",
}

export const POLISH_ROLES = {
  MAIN: "Główna",
  SUPPORTING: "Drugoplanowa",
  BACKGROUND: "Tło",
}

