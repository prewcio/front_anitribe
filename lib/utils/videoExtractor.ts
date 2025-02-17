export async function getPlayableVideoUrl(url: string): Promise<string> {
  try {
    console.log('Starting video URL extraction for:', url);
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    console.log('Detected hostname:', hostname);

    // Check if it's a direct video URL
    if (url.match(/\.(mp4|m3u8|webm|mkv|avi|mov|flv)(\?|$)/i)) {
      console.log('Direct video URL detected, returning as is:', url);
      return url;
    }

    // For all other URLs, try to extract through our API
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'http://localhost:3000';

    console.log('Using server-side API for video extraction');
    const response = await fetch(`${baseUrl}/api/video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': url
      },
      body: JSON.stringify({ 
        url,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': url,
          'X-Requested-With': 'XMLHttpRequest'
        }
      }),
    });

    if (!response.ok) {
      // If server extraction fails, try client-side extraction as fallback
      console.log('Server extraction failed, attempting client-side extraction');
      try {
        const pageResponse = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': url
          }
        });
        const html = await pageResponse.text();
        
        // Try various patterns to find video URL
        const patterns = [
          /https?:\/\/[^"'\s]+\.(?:mp4|m3u8|webm)[^"'\s]*/i,
          /<source[^>]+src=["']([^"']+)["']/i,
          /file:\s*["']([^"']+)["']/i,
          /source:\s*["']([^"']+)["']/i,
          /url:\s*["']([^"']+)["']/i,
          /videoUrl:\s*["']([^"']+)["']/i,
          /player\.src\(\s*{\s*src:\s*"([^"]+)"/,
          /"qualities":\s*{[^}]*"[^"]*":\s*"([^"]*)"/,
          /video_url:\s*["']([^"']+)["']/i
        ];

        for (const pattern of patterns) {
          const match = html.match(pattern);
          if (match) {
            const extractedUrl = match[1] || match[0];
            if (extractedUrl.match(/^https?:\/\//)) {
              console.log('Found video URL through client-side pattern:', pattern);
              return extractedUrl;
            }
          }
        }

        // Look for JSON configurations
        const jsonPatterns = [
          /playerConfig\s*=\s*({[^}]+})/,
          /jwConfig\s*=\s*({[^}]+})/,
          /player\.setup\(\s*({[^}]+})/,
          /videoConfig\s*=\s*({[^}]+})/
        ];

        for (const pattern of jsonPatterns) {
          const match = html.match(pattern);
          if (match) {
            try {
              const config = JSON.parse(match[1].replace(/'/g, '"'));
              if (config.file || config.url || config.source) {
                const videoUrl = config.file || config.url || config.source;
                if (videoUrl.match(/^https?:\/\//)) {
                  console.log('Found video URL in player config');
                  return videoUrl;
                }
              }
            } catch (e) {
              console.error('Error parsing player config:', e);
            }
          }
        }
      } catch (clientError) {
        console.error('Client-side extraction failed:', clientError);
      }

      const error = await response.json();
      console.error('Video extraction failed:', error);
      throw new Error(error.error || 'Failed to extract video URL');
    }

    const data = await response.json();
    console.log('Successfully extracted video URL:', data.url);
    return data.url;
  } catch (error) {
    console.error('Error in getPlayableVideoUrl:', error);
    throw error;
  }
}

async function extractLuluvdoClientSide(url: string): Promise<string> {
  try {
    console.log('Starting Luluvdo extraction process');
    // First, fetch the page to get the video ID
    console.log('Fetching Luluvdo page:', url);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = await response.text();
    console.log('Successfully fetched Luluvdo page');
    
    // Extract video ID
    console.log('Searching for video ID in page content');
    const videoIdMatch = html.match(/video_id:\s*['"]([^'"]+)['"]/);
    if (!videoIdMatch) {
      console.error('No video ID found in page content');
      throw new Error('Could not find video ID');
    }

    const videoId = videoIdMatch[1];
    console.log('Found video ID:', videoId);
    
    // Make API request to get the video sources
    console.log('Requesting video sources from Luluvdo API');
    const apiResponse = await fetch(`https://luluvdo.com/api/source/${videoId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await apiResponse.json();
    console.log('API response:', data);

    if (!data.data || !data.data.length) {
      console.error('No video sources in API response');
      throw new Error('No video sources found');
    }

    // Get the highest quality source
    const sources = data.data.sort((a: any, b: any) => {
      const qualityA = parseInt(a.label);
      const qualityB = parseInt(b.label);
      return qualityB - qualityA;
    });

    console.log('Available video qualities:', sources.map((s: any) => s.label));
    console.log('Selected video URL:', sources[0].file);
    return sources[0].file;
  } catch (error) {
    console.error('Error extracting Luluvdo URL client-side:', error);
    throw error;
  }
}

async function extractLycroisClientSide(url: string): Promise<string> {
  try {
    console.log('Starting Lycrois extraction process');
    // First, fetch the page
    console.log('Fetching Lycrois page:', url);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = await response.text();
    console.log('Successfully fetched Lycrois page');

    // Look for pixeldrain URLs first
    console.log('Searching for pixeldrain URL');
    const pixeldrainMatch = html.match(/https:\/\/pixeldrain\.com\/api\/file\/([^"'\s]+)/);
    if (pixeldrainMatch) {
      console.log('Found pixeldrain URL:', pixeldrainMatch[0]);
      return pixeldrainMatch[0];
    }

    // Look for direct video URLs
    console.log('Searching for direct video URLs');
    const videoUrlMatch = html.match(/https:\/\/[^"'\s]+\.(mp4|m3u8)[^"'\s]*/);
    if (videoUrlMatch) {
      console.log('Found direct video URL:', videoUrlMatch[0]);
      return videoUrlMatch[0];
    }

    // If no direct URL found, try to extract from player configuration
    console.log('Searching for player configuration');
    const playerConfigMatch = html.match(/playerConfig\s*=\s*({[^}]+})/);
    if (playerConfigMatch) {
      try {
        const config = JSON.parse(playerConfigMatch[1].replace(/'/g, '"'));
        if (config.url) {
          console.log('Found URL in player config:', config.url);
          return config.url;
        }
      } catch (e) {
        console.error('Error parsing player config:', e);
      }
    }

    // If still no URL found, look for source tags
    console.log('Searching for source tags');
    const sourceMatch = html.match(/<source[^>]+src=["']([^"']+)["']/i);
    if (sourceMatch) {
      console.log('Found URL in source tag:', sourceMatch[1]);
      return sourceMatch[1];
    }

    console.error('No video URL found in any location');
    throw new Error('Could not find video URL');
  } catch (error) {
    console.error('Error extracting Lycrois URL client-side:', error);
    throw error;
  }
}

// Helper function to check if a URL is supported (now always returns true)
export function isSupportedVideoHost(url: string): boolean {
  try {
    new URL(url); // Just validate that it's a valid URL
    return true;
  } catch {
    console.error('Invalid URL format');
    return false;
  }
} 