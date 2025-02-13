import Link from "next/link"

interface StudioButtonProps {
  studio: string,
  id: number
}

export function StudioButton({ studio, id }: StudioButtonProps) {
  return (
    <Link
      href={`/browse?studio=${encodeURIComponent(studio)}`}
      className="inline-block bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 hover:bg-secondary/80 transition-colors"
    >
      {studio} ({id})
    </Link>
  )
}

