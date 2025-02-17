import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  const source = searchParams.get('source')

  if (!url || !source) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  try {
    let videoUrl = ''
    
    switch(source.toLowerCase()) {
      case 'cda':
        videoUrl = await handleCDA(url)
        break
      case 'vk':
        videoUrl = await handleVK(url)
        break
      case 'luluvdo':
        videoUrl = await handleLuluvdo(url)
        break
      // Add cases for other sources
      default:
        return NextResponse.json({ error: 'Unsupported source' }, { status: 400 })
    }

    return NextResponse.json({ url: videoUrl })
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 })
  }
}

async function handleCDA(url: string) {
  // CDA.pl scraping logic
  const response = await fetch(url)
  const html = await response.text()
  const match = html.match(/player_data\.a0\s*=\s*'([^']+)/)
  if (match) {
    const decoded = Buffer.from(match[1], 'base64').toString()
    const json = JSON.parse(decoded)
    return json.video.file
  }
  throw new Error('CDA video not found')
}

async function handleVK(url: string) {
  // VK video scraping logic
  const response = await fetch(url)
  const html = await response.text()
  const match = html.match(/url(\d+)\s*:\s*'([^']+)/g)
  if (match) {
    const bestQuality = match.pop()?.split("'")[1]
    return bestQuality
  }
  throw new Error('VK video not found')
}

// Add similar handlers for other sources 