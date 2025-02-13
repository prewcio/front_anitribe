import { Button } from "@/components/ui/button"
import { PlayCircle } from "lucide-react"

export function HeroSection() {
  return (
    <div className="relative h-[70vh] rounded-2xl overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/placeholder.svg?height=800&width=1400"
          alt="Wyróżnione anime"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-background-primary/50 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold">Solo Leveling</h1>
        <p className="text-sm md:text-lg lg:text-xl text-text-secondary max-w-2xl">
          Po pojawieniu się tajemniczej bramy na świecie, łowcy muszą stawić czoła śmiertelnym potworom, aby chronić
          ludzkość. Sung Jin-Woo, najsłabszy łowca na świecie, wyrusza w podróż, aby stać się najsilniejszym ze
          wszystkich.
        </p>
        <div className="flex gap-4">
          <Button size="lg" className="gap-2">
            <PlayCircle className="w-5 h-5" />
            Oglądaj teraz
          </Button>
          <Button size="lg" variant="outline">
            Dodaj do listy
          </Button>
        </div>
      </div>
    </div>
  )
}

