export interface VideoSection {
  name: string
  start: number
  end: number
  color: string
}

export interface PlayerTheme {
  name: string
  fontFamily: string
  className: string
}

export interface VideoProgress {
  animeId: number
  episodeId: number
  timestamp: number
  updatedAt: string
}

