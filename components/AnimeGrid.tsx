"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

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
          transition={{ duration: 0.3, delay: (index % 20) * 0.1 }}
        >
          <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0 relative">
              <img
                src={item.coverImage?.large || "/placeholder.svg"}
                alt={item.title.romaji}
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <div className="absolute top-0 right-0 bg-accent-primary text-white px-2 py-1 text-sm font-bold">
                {item.averageScore ? `${item.averageScore}%` : "N/A"}
              </div>
            </CardContent>
            <CardHeader className="flex-1 flex flex-col justify-between">
              <CardTitle className="text-lg line-clamp-2">{item.title.romaji}</CardTitle>
              <div className="space-y-1 mt-2">
                <p className="text-sm text-muted-foreground">Odcinki: {item.episodes || "N/A"}</p>
                <p className="text-sm text-muted-foreground">Format: {formatMap[item.format] || "N/A"}</p>
              </div>
              <Link href={`/anime/${item.id}`} className="mt-4">
                <Button
                  variant="outline"
                  className="w-full transition-colors duration-300 hover:bg-accent-primary hover:text-white"
                >
                  Zobacz więcej
                </Button>
              </Link>
            </CardHeader>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

