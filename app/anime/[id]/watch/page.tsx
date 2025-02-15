import { Suspense } from "react"
import { getAnimeDetails } from "@/lib/api/anilist"
import { getEpisodeData, getAnimeComments } from "@/lib/api/laravel"
import { VideoPlayer } from "@/components/VideoPlayer/VideoPlayer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import LoadingSpinner from "@/components/LoadingSpinner"
import Comments from "@/components/Comments"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { WatchPageClient } from "./WatchPageClient"

interface Props {
  params: {
    id: string
  }
  searchParams: { episode?: string; tab?: string }
}

async function WatchPage({ params, searchParams }: Props) {
  const animeId = Number.parseInt(params.id, 10)
  const episodeId = searchParams.episode ? Number.parseInt(searchParams.episode, 10) : 1
  const currentTab = searchParams.tab || "episodes"

  const [animeData, episodeData, commentsData] = await Promise.all([
    getAnimeDetails(animeId),
    getEpisodeData(animeId, episodeId),
    getAnimeComments(animeId)
  ])

  return (
    <WatchPageClient 
      anime={animeData}
      episode={episodeData}
      comments={commentsData}
      currentTab={currentTab}
    />
  )
}

export default function AnimeWatchPage(props: Props) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <WatchPage {...props} />
    </Suspense>
  )
}

export { generateMetadata } from "./metadata"

