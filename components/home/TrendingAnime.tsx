import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export function TrendingAnime() {
  const trendingAnime = [
    { id: 1, title: "Demon Slayer", image: "/placeholder.svg?height=300&width=200", rating: 9.2 },
    { id: 2, title: "My Hero Academia", image: "/placeholder.svg?height=300&width=200", rating: 8.9 },
    { id: 3, title: "Attack on Titan", image: "/placeholder.svg?height=300&width=200", rating: 9.5 },
    { id: 4, title: "Jujutsu Kaisen", image: "/placeholder.svg?height=300&width=200", rating: 9.1 },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Popularne teraz</h2>
        <Button variant="ghost" className="gap-2">
          Zobacz wszystkie <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trendingAnime.map((anime) => (
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
                    <p className="text-white/80 text-sm">Ocena: {anime.rating}</p>
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

