import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { getCharacterDetails } from "@/lib/api/anilist"
import { Card, CardContent } from "@/components/ui/card"
import LoadingSpinner from "@/components/LoadingSpinner"
import ErrorMessage from "@/components/ErrorMessage"
import { formatDescription } from "@/lib/utils/formatDescription"
import { translateWithCache } from "@/lib/utils/translate"
import { cache } from "@/lib/api/cache"

interface Props {
  params: { id: string }
}

async function CharacterDetails({ id }: { id: number }) {
  try {
    const character = await getCharacterDetails(id)

    // Format the already translated description
    const formattedDescription = character.description 
      ? await formatDescription(character.description)
      : '';

    // Cache character data
    const cacheKey = `character:${id}`;
    cache.set(cacheKey, {
      data: character,
      timestamp: Date.now(),
    });

    const translateRole = (role: string) => {
      switch (role) {
        case "MAIN":
          return "Główna"
        case "SUPPORTING":
          return "Drugoplanowa"
        case "BACKGROUND":
          return "Tło"
        default:
          return role
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <Image
              src={character.image.large || "/placeholder.svg"}
              alt={character.name.full}
              width={300}
              height={450}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-2/3 space-y-4">
            <h1 className="text-3xl font-bold">{character.name.full}</h1>
            <p className="text-lg text-muted-foreground">{character.name.native}</p>
            {character.description && (
              <article
                className="prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg prose-a:text-primary hover:prose-a:opacity-80 max-w-none"
                dangerouslySetInnerHTML={{
                  __html: formattedDescription,
                }}
              />
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Występuje w:</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {character.media.edges.map((edge: any) => (
              <Link href={`/anime/${edge.node.id}`} key={edge.node.id}>
                <Card className="hover:bg-accent transition-colors">
                  <CardContent className="p-0">
                    <Image
                      src={edge.node.coverImage.medium || "/placeholder.svg"}
                      alt={edge.node.title.romaji}
                      width={200}
                      height={300}
                      className="w-full object-cover aspect-[2/3]"
                    />
                  </CardContent>
                  <div className="p-2">
                    <p className="font-medium text-sm line-clamp-2">{edge.node.title.romaji}</p>
                    <p className="text-xs text-muted-foreground">{translateRole(edge.characterRole)}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return <ErrorMessage message="Nie udało się załadować szczegółów postaci. Spróbuj ponownie później." />
  }
}

export default function CharacterPage({ params }: Props) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <CharacterDetails id={Number.parseInt(params.id)} />
      </Suspense>
    </div>
  )
}

