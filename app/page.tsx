import { HeroSection } from "@/components/home/HeroSection"
import { TrendingAnime } from "@/components/home/TrendingAnime"
import { ContinueWatching } from "@/components/home/ContinueWatching"
import { SeasonalAnime } from "@/components/home/SeasonalAnime"
import { RecommendedAnime } from "@/components/home/RecommendedAnime"

export default function HomePage() {
  return (
    <div className="space-y-8">
      <HeroSection />
      <ContinueWatching />
      <TrendingAnime />
      <SeasonalAnime />
      <RecommendedAnime />
    </div>
  )
}

