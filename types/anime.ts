export interface Episode {
  id: number
  number: number
  title: string
  thumbnail?: string
  languages: {
    dubbing: string[]
    subtitles: string[]
  }
  releaseDate?: string // ISO date string
}

export interface AnimeEpisode extends Episode {
  videoUrl: string
  description: string
  sections: {
    type: "OPENING" | "ENDING"
    start: number
    end: number
  }[]
}

