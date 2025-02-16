import { translate } from '@vitalets/google-translate-api';

// Helper function to extract text from HTML
function extractTextFromHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '||SPLIT||')
             .split('||SPLIT||')
             .map(part => part.trim())
             .filter(Boolean)
             .join(' ');
}

// Helper function to restore HTML tags
function restoreHtmlTags(originalHtml: string, translatedText: string): string {
  const htmlParts = originalHtml.split(/(<[^>]*>)/g);
  const textParts = translatedText.split(/\s+/);
  let textIndex = 0;
  
  return htmlParts.map(part => {
    if (part.startsWith('<')) {
      return part; // Return HTML tag as is
    } else if (part.trim()) {
      return textParts[textIndex++] || part;
    }
    return part;
  }).join('');
}

export async function translateToPolish(text: string): Promise<string> {
  if (!text) return '';
  
  try {
    // Check if text contains HTML
    const hasHtml = /<[^>]*>/g.test(text);
    
    if (hasHtml) {
      // Extract text from HTML
      const plainText = extractTextFromHtml(text);
      // Translate plain text to Polish
      const result = await translate(plainText, { 
        to: 'pl',
        from: 'en',
        host: 'translate.google.com'
      });
      // Restore HTML structure
      return restoreHtmlTags(text, result.text);
    } else {
      // Regular translation to Polish
      const result = await translate(text, { 
        to: 'pl',
        from: 'en',
        host: 'translate.google.com'
      });
      return result.text;
    }
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}

// Cache for translations to avoid unnecessary API calls
const translationCache = new Map<string, string>();

export async function translateWithCache(text: string): Promise<string> {
  if (!text) return '';
  
  // Check cache first
  const cached = translationCache.get(text);
  if (cached) {
    console.log('Translation cache hit:', {
      originalText: text.slice(0, 50) + '...',
      translatedText: cached.slice(0, 50) + '...',
      originalLength: text.length,
      translatedLength: cached.length,
    });
    return cached;
  }
  
  try {
    console.log('Starting translation:', {
      originalText: text.slice(0, 50) + '...',
      length: text.length,
    });
    const translated = await translateToPolish(text);
    console.log('Translation completed:', {
      originalText: text.slice(0, 50) + '...',
      translatedText: translated.slice(0, 50) + '...',
      originalLength: text.length,
      translatedLength: translated.length,
    });
    translationCache.set(text, translated);
    return translated;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

