import type { Character } from "@/types/anime"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function CharacterList({ characters }: { characters: Character[] }) {
  const mainCharacters = characters.filter((char) => char.role === "MAIN")
  const supportingCharacters = characters.filter((char) => char.role === "SUPPORTING")

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Main Characters</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mainCharacters.map((character) => (
            <Link key={character.id} href={`/character/${character.id}`}>
              <Card className="hover:bg-background-secondary transition-colors">
                <CardContent className="p-0">
                  <img
                    src={character.image || "/placeholder.svg"}
                    alt={`${character.name.first} ${character.name.last}`}
                    className="w-full aspect-[3/4] object-cover"
                  />
                </CardContent>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">
                    {character.name.first} {character.name.last}
                  </CardTitle>
                  <p className="text-xs text-text-secondary">{character.name.native}</p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Supporting Characters</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {supportingCharacters.map((character) => (
            <Link key={character.id} href={`/character/${character.id}`}>
              <Card className="hover:bg-background-secondary transition-colors">
                <CardContent className="p-0">
                  <img
                    src={character.image || "/placeholder.svg"}
                    alt={`${character.name.first} ${character.name.last}`}
                    className="w-full aspect-[3/4] object-cover"
                  />
                </CardContent>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">
                    {character.name.first} {character.name.last}
                  </CardTitle>
                  <p className="text-xs text-text-secondary">{character.name.native}</p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

