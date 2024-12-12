import { NextResponse } from "next/server"
import { headers } from "next/headers"

export async function GET(request: Request, { params }: { params: { id: string; episodeId: string } }) {
  const headersList = headers()
  const token = headersList.get("Cookie")?.split("token=")[1]

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const response = await fetch(`${process.env.LARAVEL_API_URL}/api/anime/${params.id}/episodes/${params.episodeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })

  const data = await response.json()

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status })
  }

  // Expected response from Laravel:
  // {
  //   id: number
  //   number: number
  //   title: string
  //   video_url: string
  //   sections: Array<{
  //     type: 'OPENING' | 'ENDING'
  //     start: number
  //     end: number
  //   }>
  // }

  return NextResponse.json(data)
}

