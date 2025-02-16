import { NextResponse } from 'next/server'

const ANILIST_API_URL = 'https://graphql.anilist.co'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
      next: {
        revalidate: 60 * 5, // Cache for 5 minutes
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('AniList API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })
      return NextResponse.json(
        { error: `AniList API Error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in AniList proxy route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch from AniList API', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 