import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PlayCircle } from "lucide-react"

export function ContinueWatching() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kontynuuj oglądanie</h2>
        <Link href="/lista/ogladane" className="text-text-secondary hover:text-text-primary transition-colors">
          Zobacz wszystkie
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="group relative overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video relative">
                <img
                  src="/placeholder.svg?height=200&width=350"
                  alt="Miniatura anime"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <PlayCircle className="w-12 h-12" />
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold truncate">Jujutsu Kaisen Sezon 2</h3>
                <p className="text-sm text-text-secondary">Odcinek 8 z 24</p>
                <Progress value={33} className="h-1" />
                <p className="text-xs text-text-secondary">Pozostało 12:42</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

