import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function LoadingCard() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="w-full h-48 bg-background-secondary animate-pulse" />
      </CardContent>
      <CardHeader>
        <div className="space-y-2">
          <div className="h-5 bg-background-secondary rounded animate-pulse" />
          <div className="h-4 bg-background-secondary rounded w-2/3 animate-pulse" />
        </div>
      </CardHeader>
    </Card>
  )
}

