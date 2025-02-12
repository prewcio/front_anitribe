import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export function RecommendedAnime() {
  const recommendedAnime = [
    { id: 1, title: "Recommended Anime 1", image: "/placeholder.svg?height=300&width=200", genre: "Action" },
    { id: 2, title: "Recommended Anime 2", image: "/placeholder.svg?height=300&width=200", genre: "Romance" },
    { id: 3, title: "Recommended Anime 3", image: "/placeholder.svg?height=300&width=200", genre: "Sci-Fi" },
    { id: 4, title: "Recommended Anime 4", image: "/placeholder.svg?height=300&width=200", genre: "Comedy" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recommended for You</h2>
        <Button variant="ghost" className="gap-2">
          View All <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendedAnime.map((anime) => (
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
                    <p className="text-white/80 text-sm">{anime.genre}</p>
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

