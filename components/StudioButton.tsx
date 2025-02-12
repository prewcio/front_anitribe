import Link from "next/link"

interface StudioButtonProps {
  studio: string
}

export function StudioButton({ studio }: StudioButtonProps) {
  return (
    <Link
      href={`/browse?studio=${encodeURIComponent(studio)}`}
      className="inline-block bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 hover:bg-secondary/80 transition-colors"
    >
      {studio}
    </Link>
  )
}

