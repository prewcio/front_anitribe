"use client"

import { useState, useEffect } from "react"
import { getAnimeDetails } from "@/lib/api/anilist"
import { getAnimeEpisodes, getAnimeComments } from "@/lib/api/laravel"

interface Episode {
  id: number
  number: number
  title: string
  description: string
  thumbnail: string
  languages: {
    dubbing: string[]
    subtitles: string[]
  }
  releaseDate?: string
}

interface UseEpisodeResult {
  animeId: number
  episode: Episode | null
  previousEpisode: number | null
  nextEpisode: number | null
  comments: any[]
}

export function useEpisode(animeId: string, episodeId?: string): UseEpisodeResult {
  const [anime, setAnime] = useState<any>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [comments, setComments] = useState<any[]>([])
  const parsedAnimeId = Number.parseInt(animeId, 10)
  const parsedEpisodeId = episodeId ? Number.parseInt(episodeId, 10) : null

  useEffect(() => {
    const fetchAnimeData = async () => {
      const animeData = await getAnimeDetails(parsedAnimeId)
      setAnime(animeData)
      const episodeData = await getAnimeEpisodes(parsedAnimeId)
      setEpisodes(episodeData)
      const commentData = await getAnimeComments(parsedAnimeId)
      setComments(commentData)
    }
    fetchAnimeData()
  }, [parsedAnimeId])

  const episode = episodes.find((ep) => ep.number === parsedEpisodeId) || null
  const episodeIndex = episodes.findIndex((ep) => ep.number === parsedEpisodeId)
  const previousEpisode = episodeIndex > 0 ? episodes[episodeIndex - 1].number : null
  const nextEpisode = episodeIndex < episodes.length - 1 ? episodes[episodeIndex + 1].number : null

  return {
    animeId: parsedAnimeId,
    episode,
    previousEpisode,
    nextEpisode,
    comments,
  }
}

