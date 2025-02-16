import { Metadata, ResolvingMetadata } from "next"
import { getAnimeDetails } from "@/lib/api/anilist"
import { getEpisodeData } from "@/lib/api/laravel"

interface Props {
  params: {
    id: string
  }
  searchParams: { episode?: string }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const animeId = Number.parseInt(params.id, 10)
  const episodeId = searchParams.episode ? Number.parseInt(searchParams.episode, 10) : 1
  
  const [anime, episode] = await Promise.all([
    getAnimeDetails(animeId),
    getEpisodeData(animeId, episodeId)
  ])

  // Handle case where anime or episode data is missing
  if (!anime?.title?.romaji || !episode?.number) {
    return {
      title: 'Oglądaj anime online | AniTribe',
      description: 'Oglądaj anime online w najlepszej jakości na AniTribe',
    }
  }

  const title = `${anime.title.romaji} - Odcinek ${episode.number}`
  const description = `Oglądaj ${anime.title.romaji} odcinek ${episode.number} online w najlepszej jakości na AniTribe`

  return {
    title: {
      absolute: `${title} | AniTribe`,
    },
    description: description,
    alternates: {
      languages: {
        'en': `${anime.title.english || anime.title.romaji} - Episode ${episode.number}`,
        'ja': `${anime.title.native || anime.title.romaji} - ${episode.number}話`,
        'ja-Latn': `${anime.title.romaji} - Episode ${episode.number}`,
      }
    },
    openGraph: {
      title: title,
      description: description,
      images: [episode.thumbnail || anime.bannerImage || anime.coverImage.large],
      locale: 'pl_PL',
      siteName: 'AniTribe',
      type: 'video.episode'
    },
  }
} 