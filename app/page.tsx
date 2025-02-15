import { Suspense } from "react"
import { HeroAnime } from "@/components/home/HeroAnime"
import { WatchingNow } from "@/components/home/WatchingNow"
import { SystemNewsFeed } from "@/components/home/SystemNewsFeed"
import { SeasonalAnime } from "@/components/home/SeasonalAnime"
import { PopularNow } from "@/components/home/PopularNow"
import { UpcomingAnime } from "@/components/home/UpcomingAnime"

function HomeContent() {
  return (
    <div className="container translate-y-[-50px] space-y-8 py-8">
      <HeroAnime />
      <WatchingNow />
      <SystemNewsFeed />
      <SeasonalAnime />
      <PopularNow />
      <UpcomingAnime />
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}

