"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Star } from "lucide-react"

interface AnimeGridItem {
  id: number
  title: {
    romaji: string
    english: string
    native: string
  }
  coverImage?: {
    large?: string
  }
  averageScore: number
  episodes: number
  format: string
}

interface AnimeGridProps {
  items: AnimeGridItem[]
}

const formatMap: { [key: string]: string } = {
  TV: "Serial",
  TV_SHORT: "Krótki serial",
  MOVIE: "Film",
  OVA: "OVA",
  ONA: "ONA",
  SPECIAL: "Specjalny"
}

export default function AnimeGrid({ items }: AnimeGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: (index % 40) * 0.1 }}
        >
          <Link href={`/anime/${item.id}`}>
            <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
              <CardContent className="p-0 relative">
                <img
                  src={item.coverImage?.large || "/placeholder.svg"}
                  alt={item.title.romaji}
                  className="w-full aspect-[2/3] object-cover"
                  loading="lazy"
                />
                {item.averageScore && (
                  <div className="absolute top-2 right-2 bg-background/80 px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {item.averageScore}%
                  </div>
                )}
              </CardContent>
              <CardHeader className="flex-1 flex flex-col justify-between">
                <CardTitle className="text-lg line-clamp-2">
                  {item.title.romaji || item.title.english}
                </CardTitle>
                <div className="space-y-1 mt-2">
                  <p className="text-sm text-muted-foreground">
                    {formatMap[item.format] || item.format} • {item.episodes || "?"} odcinków
                  </p>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

