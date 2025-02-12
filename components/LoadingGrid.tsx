import LoadingCard from "./LoadingCard"

export default function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  )
}

