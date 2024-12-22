import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getForumCategories } from "@/lib/api/laravel"

export default async function ForumPage() {
  const categories = await getForumCategories()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Forum</h1>
        <Button asChild>
          <Link href="/forum/new-thread">New Thread</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {category.threads.map((thread) => (
                  <li key={thread.id} className="flex justify-between items-center">
                    <Link href={`/forum/thread/${thread.id}`} className="hover:underline">
                      {thread.title}
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      {thread.replyCount} replies • Last: {new Date(thread.lastReplyDate).toLocaleDateString()}
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

