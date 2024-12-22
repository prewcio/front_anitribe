import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// This is mock data. In a real app, you would fetch this from your backend.
const mockForumData = {
  categories: [
    {
      id: 1,
      name: "Ogólna dyskusja",
      threads: [
        {
          id: 1,
          title: "Wasze ulubione anime sezonu?",
          replyCount: 25,
          lastReplyDate: "2023-06-10T14:30:00Z",
        },
        {
          id: 2,
          title: "Najlepsze openingi wszech czasów",
          replyCount: 42,
          lastReplyDate: "2023-06-11T09:15:00Z",
        },
      ],
    },
    {
      id: 2,
      name: "Recenzje i rekomendacje",
      threads: [
        {
          id: 3,
          title: "Attack on Titan - recenzja finałowego sezonu",
          replyCount: 50,
          lastReplyDate: "2023-06-09T18:45:00Z",
        },
        {
          id: 4,
          title: "Underrated anime, które warto obejrzeć",
          replyCount: 37,
          lastReplyDate: "2023-06-12T11:20:00Z",
        },
      ],
    },
  ],
}

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Forum Społeczności</h1>
        <Button asChild>
          <Link href="/community/new-thread">Nowy Wątek</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {mockForumData.categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {category.threads.map((thread) => (
                  <li key={thread.id} className="flex justify-between items-center">
                    <Link href={`/community/thread/${thread.id}`} className="hover:underline">
                      {thread.title}
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      {thread.replyCount} odpowiedzi • Ostatnia: {new Date(thread.lastReplyDate).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

