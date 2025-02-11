import type { AnimeBase } from "@/types/anime"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SimilarAnime({ anime }: { anime: AnimeBase[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {anime.map((item) => (
        <Link key={item.id} href={`/anime/${item.id}`}>
          <Card className="hover:bg-background-secondary transition-colors">
            <CardContent className="p-0">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title.english}
                className="w-full aspect-[3/4] object-cover"
              />
            </CardContent>
            <CardHeader className="p-3">
              <CardTitle className="text-sm">{item.title.english}</CardTitle>
              <p className="text-xs text-text-secondary">
                {item.type} · {item.episodes} eps
              </p>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}

