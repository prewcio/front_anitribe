import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export function SeasonalAnime() {
  const seasonalAnime = [
    { id: 1, title: "Spring 2023 Anime 1", image: "/placeholder.svg?height=300&width=200", episodes: 12 },
    { id: 2, title: "Spring 2023 Anime 2", image: "/placeholder.svg?height=300&width=200", episodes: 24 },
    { id: 3, title: "Spring 2023 Anime 3", image: "/placeholder.svg?height=300&width=200", episodes: 13 },
    { id: 4, title: "Spring 2023 Anime 4", image: "/placeholder.svg?height=300&width=200", episodes: 12 },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Spring 2023 Anime</h2>
        <Button variant="ghost" className="gap-2">
          View All <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {seasonalAnime.map((anime) => (
          <Link href={`/anime/${anime.id}`} key={anime.id}>
            <Card className="overflow-hidden transition-transform hover:scale-105">
              <CardContent className="p-0">
                <div className="relative aspect-[2/3]">
                  <img
                    src={anime.image || "/placeholder.svg"}
                    alt={anime.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-white font-semibold truncate">{anime.title}</h3>
                    <p className="text-white/80 text-sm">{anime.episodes} episodes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

