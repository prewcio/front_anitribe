import { NextResponse } from 'next/server'

const GOOGLE_TRANSLATE_API = 'https://translate.googleapis.com/translate_a/single'

export async function POST(request: Request) {
  try {
    const { text, from = 'en', to = 'pl' } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    const params = new URLSearchParams({
      client: 'gtx',
      sl: from,
      tl: to,
      dt: 't',
      q: text,
    })

    const response = await fetch(`${GOOGLE_TRANSLATE_API}?${params}`)

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`)
    }

    const data = await response.json()
    const translatedText = data[0]?.map((item: any[]) => item[0]).join('')

    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Translation failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 