import { NextResponse } from 'next/server'

const MAL_API_URL = 'https://api.myanimelist.net/v2'
const MAL_CLIENT_ID = process.env.NEXT_PUBLIC_MAL_CLIENT_ID

if (!MAL_CLIENT_ID) {
  console.warn('MAL_CLIENT_ID is not set in environment variables')
}

export async function GET(request: Request) {
  try {
    // Parse the request URL
    const requestUrl = new URL(request.url)
    const endpoint = requestUrl.searchParams.get('endpoint')
    
    if (!endpoint) {
      return NextResponse.json({ error: 'Missing endpoint parameter' }, { status: 400 })
    }

    if (!MAL_CLIENT_ID) {
      return NextResponse.json(
        { error: 'MAL Client ID not configured. Please set NEXT_PUBLIC_MAL_CLIENT_ID in your environment variables.' },
        { status: 500 }
      )
    }

    // Create a new URLSearchParams for the MAL API
    const malParams = new URLSearchParams()
    
    // Copy all parameters except 'endpoint'
    requestUrl.searchParams.forEach((value, key) => {
      if (key !== 'endpoint') {
        malParams.append(key, value)
      }
    })

    try {
      // Construct the full URL
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
      const baseUrl = `${MAL_API_URL}/${cleanEndpoint}`
      
      // Log the URL construction process
      console.log('Constructing MAL API URL:', {
        baseUrl,
        params: Object.fromEntries(malParams.entries()),
        endpoint,
        cleanEndpoint
      })

      const url = new URL(baseUrl)
      
      // Add search params if they exist
      const searchString = malParams.toString()
      if (searchString) {
        url.search = searchString
      }

      console.log('Fetching MAL API:', { 
        url: url.toString(), 
        clientId: MAL_CLIENT_ID?.slice(0, 5) + '...',
      })

      const response = await fetch(url, {
        headers: {
          'X-MAL-CLIENT-ID': MAL_CLIENT_ID,
        },
        next: {
          revalidate: 60 * 5, // Cache for 5 minutes
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('MAL API Error:', {
          status: response.status,
          statusText: response.statusText,
          url: url.toString(),
          body: errorText,
          headers: Object.fromEntries(response.headers.entries())
        })
        return NextResponse.json(
          { error: `MAL API Error: ${response.status} ${response.statusText}`, details: errorText },
          { status: response.status }
        )
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (urlError) {
      console.error('URL parsing error:', {
        error: urlError,
        endpoint,
        params: Object.fromEntries(malParams.entries())
      })
      return NextResponse.json(
        { error: 'Invalid URL construction', details: urlError instanceof Error ? urlError.message : String(urlError) },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error in MAL proxy route:', {
      error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: 'Failed to fetch from MAL API', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 