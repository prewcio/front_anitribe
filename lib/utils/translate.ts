// Cache for translations to avoid unnecessary API calls
const translationCache = new Map<string, { text: string; timestamp: number }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Helper function to extract text from HTML
function extractTextFromHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

// Helper function to restore HTML tags
function restoreHtmlTags(originalHtml: string, translatedText: string): string {
  const tags: string[] = []
  const cleanHtml = originalHtml.replace(/<[^>]*>/g, (tag) => {
    tags.push(tag)
    return '|TAG|'
  })

  const translatedParts = translatedText.split('|TAG|')
  let result = ''
  
  for (let i = 0; i < translatedParts.length; i++) {
    result += translatedParts[i]
    if (i < tags.length) {
      result += tags[i]
    }
  }

  return result
}

export async function translateWithCache(text: string, from: string = 'en', to: string = 'pl'): Promise<string> {
  if (!text) return ''

  // Generate cache key
  const cacheKey = `${from}:${to}:${text}`

  // Check cache
  const cached = translationCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.text
  }

  try {
    // Extract text from HTML
    const plainText = extractTextFromHtml(text)

    // Get the base URL based on environment
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'http://localhost:3000'

    // Call our translation API
    const response = await fetch(`${baseUrl}/api/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: plainText,
        from,
        to,
      }),
    })

    if (!response.ok) {
      throw new Error('Translation failed')
    }

    const { translatedText } = await response.json()

    // Restore HTML tags
    const finalText = restoreHtmlTags(text, translatedText)

    // Cache the result
    translationCache.set(cacheKey, {
      text: finalText,
      timestamp: Date.now(),
    })

    return finalText
  } catch (error) {
    console.error('Translation error:', error)
    return text // Return original text on error
  }
}

