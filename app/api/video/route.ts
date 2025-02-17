import { NextResponse } from 'next/server'

async function extractCdaUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.cda.pl/'
      }
    });
    const html = await response.text();
    
    let videoUrl = null;
    
    // Method 1: player_data with improved regex and JSON handling
    const playerDataMatch = html.match(/player_data='([^']+)'/);
    if (playerDataMatch) {
      try {
        const encodedData = playerDataMatch[1];
        const decodedData = decodeURIComponent(encodedData);
        // Clean the JSON string before parsing
        const cleanedData = decodedData
          .replace(/\\'/g, "'")
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');
        const playerData = JSON.parse(cleanedData);
        if (playerData.video?.file) {
          videoUrl = playerData.video.file;
        }
      } catch (e) {
        console.error('Error parsing player_data:', e);
      }
    }
    
    // Method 2: qualities object with improved regex
    if (!videoUrl) {
      const qualitiesMatch = html.match(/qualities\s*=\s*(\{[^}]+\})/);
      if (qualitiesMatch) {
        try {
          const cleanedQualities = qualitiesMatch[1]
            .replace(/'/g, '"')
            .replace(/([{,]\s*)(\w+):/g, '$1"$2":');
          const qualities = JSON.parse(cleanedQualities);
          const highestQuality = Math.max(...Object.keys(qualities).map(Number));
          videoUrl = qualities[highestQuality];
        } catch (e) {
          console.error('Error parsing qualities:', e);
        }
      }
    }
    
    // Method 3: video tag with improved regex
    if (!videoUrl) {
      const videoTagMatch = html.match(/<video[^>]*>\s*<source[^>]+src="([^"]+)"/);
      if (videoTagMatch) {
        videoUrl = videoTagMatch[1];
      }
    }
    
    // Method 4: mediaFiles array with improved regex
    if (!videoUrl) {
      const mediaFilesMatch = html.match(/mediaFiles\s*=\s*(\[[^\]]+\])/);
      if (mediaFilesMatch) {
        try {
          const cleanedMediaFiles = mediaFilesMatch[1]
            .replace(/'/g, '"')
            .replace(/([{,]\s*)(\w+):/g, '$1"$2":');
          const mediaFiles = JSON.parse(cleanedMediaFiles);
          if (mediaFiles.length > 0) {
            videoUrl = mediaFiles[0].url;
          }
        } catch (e) {
          console.error('Error parsing mediaFiles:', e);
        }
      }
    }

    return videoUrl;
  } catch (error) {
    console.error('Error extracting CDA URL:', error);
    return null;
  }
}

async function extractVkUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = await response.text();
    
    let videoUrl = null;
    
    // Method 1: json_data
    const jsonMatch = html.match(/var\s+playerParams\s*=\s*({[^}]+})/);
    if (jsonMatch) {
      try {
        const playerParams = JSON.parse(jsonMatch[1].replace(/'/g, '"'));
        if (playerParams.url) {
          videoUrl = playerParams.url;
        }
      } catch (e) {
        console.error('Error parsing player params:', e);
      }
    }
    
    // Method 2: direct video URLs
    if (!videoUrl) {
      const urlMatches = html.match(/https?:\/\/[^"']+\.(?:mp4|m3u8)[^"']*/g);
      if (urlMatches) {
        videoUrl = urlMatches[0];
      }
    }
    
    // Method 3: video data in JSON
    if (!videoUrl) {
      const videoDataMatch = html.match(/var\s+videoData\s*=\s*({[^}]+})/);
      if (videoDataMatch) {
        try {
          const videoData = JSON.parse(videoDataMatch[1].replace(/'/g, '"'));
          if (videoData.url) {
            videoUrl = videoData.url;
          }
        } catch (e) {
          console.error('Error parsing video data:', e);
        }
      }
    }

    return videoUrl;
  } catch (error) {
    console.error('Error extracting VK URL:', error)
    return null
  }
}

async function extractDailymotionUrl(url: string): Promise<string | null> {
  try {
    // Extract video ID
    const videoId = url.match(/video\/([^_?]+)/)?.[1];
    if (!videoId) {
      console.error('Could not extract Dailymotion video ID');
      return null;
    }
    
    // Get metadata with proper headers
    const metadataUrl = `https://www.dailymotion.com/player/metadata/video/${videoId}`;
    const metadataResponse = await fetch(metadataUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.dailymotion.com/'
      }
    });
    
    if (!metadataResponse.ok) {
      console.error('Failed to fetch Dailymotion metadata:', metadataResponse.status);
      return null;
    }
    
    const metadata = await metadataResponse.json();
    
    // Check if qualities exist and get the highest quality URL
    if (metadata.qualities) {
      const qualities = metadata.qualities;
      const availableQualities = Object.keys(qualities)
        .map(Number)
        .filter(q => qualities[q] && qualities[q].length > 0)
        .sort((a, b) => b - a);
      
      if (availableQualities.length > 0) {
        const highestQuality = availableQualities[0];
        if (qualities[highestQuality] && qualities[highestQuality][0]) {
          return qualities[highestQuality][0].url;
        }
      }
    }
    
    console.error('No valid qualities found in Dailymotion metadata');
    return null;
  } catch (error) {
    console.error('Error extracting Dailymotion URL:', error);
    return null;
  }
}

async function extractLuluvdoUrl(url: string): Promise<string | null> {
  console.log('Attempting to extract Luluvdo URL:', url);
  try {
    // First request to get the video ID and necessary tokens
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });
    const html = await response.text();
    console.log('Successfully fetched Luluvdo page');
    
    // Extract video ID
    const videoIdMatch = html.match(/video_id:\s*['"]([^'"]+)['"]/);
    if (!videoIdMatch) {
      console.error('Could not find video ID');
      return null;
    }
    
    const videoId = videoIdMatch[1];
    console.log('Found video ID:', videoId);
    
    // Get CSRF token if present
    const csrfMatch = html.match(/csrf-token[^>]+content="([^"]+)"/);
    const csrfToken = csrfMatch ? csrfMatch[1] : '';
    
    // Make API request with proper headers
    const apiUrl = `https://luluvdo.com/api/source/${videoId}`;
    console.log('Making API request to:', apiUrl);
    
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Origin': 'https://luluvdo.com',
        'Referer': url,
        'X-CSRF-TOKEN': csrfToken,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: `r=&d=luluvdo.com`
    });
    
    if (!apiResponse.ok) {
      console.error('API request failed:', apiResponse.status);
      return null;
    }
    
    const data = await apiResponse.json();
    console.log('API response:', data);
    
    if (data.data?.length > 0) {
      // Sort sources by quality and get the highest quality URL
      const sources = data.data.sort((a: any, b: any) => parseInt(b.label) - parseInt(a.label));
      const videoUrl = sources[0].file;
      console.log('Found video URL:', videoUrl);
      return videoUrl;
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting Luluvdo URL:', error);
    return null;
  }
}

async function extractLycroisUrl(url: string): Promise<string | null> {
  console.log('Attempting to extract Lycrois URL:', url);
  
  try {
    // Initial request with proper headers
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });
    
    const html = await response.text();
    console.log('Successfully fetched Lycrois page');
    
    // Method 1: Look for video elements first (most reliable)
    const videoMatch = html.match(/<video[^>]*>\s*<source[^>]+src=["']([^"']+)["']/i) || 
                      html.match(/<video[^>]+src=["']([^"']+)["']/i);
    if (videoMatch) {
      const videoUrl = videoMatch[1];
      console.log('Found video element URL:', videoUrl);
      return videoUrl;
    }
    
    // Method 2: Look for pixeldrain URLs with improved patterns
    const pixeldrainPatterns = [
      /<source[^>]+src=["'](https:\/\/pixeldrain\.com\/[^"']+)["']/i,
      /data-video-src=["'](https:\/\/pixeldrain\.com\/[^"']+)["']/i,
      /href=["'](https:\/\/pixeldrain\.com\/[^"']+)["']/i,
      /(https:\/\/pixeldrain\.com\/api\/file\/[^"'\s]+)/,
      /(https:\/\/pixeldrain\.com\/u\/[^"'\s]+)/
    ];
    
    for (const pattern of pixeldrainPatterns) {
      const match = html.match(pattern);
      if (match) {
        let pixeldrainUrl = match[1];
        // Convert user-facing URLs to API URLs
        if (pixeldrainUrl.includes('/u/')) {
          const fileId = pixeldrainUrl.split('/u/')[1].split(/[^a-zA-Z0-9]/)[0];
          pixeldrainUrl = `https://pixeldrain.com/api/file/${fileId}`;
        }
        console.log('Found pixeldrain URL:', pixeldrainUrl);
        return pixeldrainUrl;
      }
    }
    
    // Method 3: Look for player configuration
    const configMatch = html.match(/playerConfig\s*=\s*({[^}]+})/);
    if (configMatch) {
      try {
        const config = JSON.parse(configMatch[1].replace(/'/g, '"'));
        if (config.url) {
          console.log('Found URL in player config:', config.url);
          return config.url;
        }
      } catch (e) {
        console.error('Error parsing player config:', e);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting Lycrois URL:', error);
    return null;
  }
}

async function extractGoogleDriveUrl(url: string): Promise<string | null> {
  try {
    const fileId = extractGoogleDriveId(url);
    if (!fileId) return null;

    // Method 1: Direct download URL
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    // Method 2: Alternative player URL
    const playerUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    
    // Try to get the actual video URL from the player page
    const response = await fetch(playerUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = await response.text();
    
    const streamUrlMatch = html.match(/https:\/\/[^"']+videoplayback[^"']*/);
    if (streamUrlMatch) {
      return streamUrlMatch[0];
    }
    
    return downloadUrl;
  } catch (error) {
    console.error('Error extracting Google Drive URL:', error);
    return null;
  }
}

function extractGoogleDriveId(url: string): string | null {
  const patterns = [
    /\/d\/([^/]+)/,
    /id=([^&]+)/,
    /drive\.google\.com\/file\/d\/([^/]+)/,
    /drive\.google\.com\/open\?id=([^&]+)/,
    /drive\.google\.com\/uc\?id=([^&]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    console.log('Processing video URL:', url);
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    
    // Check if it's a direct video URL
    if (url.match(/\.(mp4|m3u8|webm)(\?|$)/i)) {
      console.log('Direct video URL detected, returning as is:', url);
      return NextResponse.json({ url });
    }

    let videoUrl: string | null = null;

    // Try to extract video URL based on host
    if (hostname.includes('cda.pl') || hostname.includes('ebd.cda.pl')) {
      videoUrl = await extractCdaUrl(url);
    } else if (hostname.includes('vk.com') || hostname.includes('vk.me')) {
      videoUrl = await extractVkUrl(url);
    } else if (hostname.includes('dailymotion.com')) {
      videoUrl = await extractDailymotionUrl(url);
    } else if (hostname.includes('luluvdo.com')) {
      console.log('Detected Luluvdo host')
      videoUrl = await extractLuluvdoUrl(url);
    } else if (hostname.includes('lycrois.cafe')) {
      console.log('Detected Lycrois host')
      videoUrl = await extractLycroisUrl(url);
    } else if (hostname.includes('drive.google.com')) {
      videoUrl = await extractGoogleDriveUrl(url);
    } else if (hostname.includes('mega.nz')) {
      // For MEGA, return the original URL for client-side handling
      videoUrl = url;
    } else {
      // For unknown hosts, try aggressive extraction
      console.log('Unknown host, trying aggressive extraction')
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        const html = await response.text();
        
        // Try multiple patterns
        const patterns = [
          // Direct video URLs
          /https?:\/\/[^"'\s]+\.(mp4|m3u8|webm)[^"'\s]*/i,
          // Source tags
          /<source[^>]+src=["']([^"']+)["']/i,
          // Video tags
          /<video[^>]+src=["']([^"']+)["']/i,
          // Player configurations
          /player\.setup\(\s*{\s*file:\s*["']([^"']+)["']/i,
          /player\.src\(\s*{\s*src:\s*["']([^"']+)["']/i,
          // JSON data
          /"url"\s*:\s*"([^"]+\.(?:mp4|m3u8|webm))"/i,
          // Playlist data
          /"file"\s*:\s*"([^"]+\.(?:mp4|m3u8|webm))"/i
        ];
        
        for (const pattern of patterns) {
          const match = html.match(pattern);
          if (match) {
            videoUrl = match[1] || match[0];
            console.log('Found video URL with pattern:', pattern, videoUrl)
            break;
          }
        }
        
        if (!videoUrl) {
          // Try to find any URL that looks like a video
          const allUrls = html.match(/https?:\/\/[^"'\s]+/g) || [];
          videoUrl = allUrls.find(u => 
            u.includes('video') || 
            u.includes('stream') || 
            u.includes('play') || 
            u.includes('source')
          ) || url;
          if (videoUrl) {
            console.log('Found potential video URL:', videoUrl)
          }
        }
      } catch (error) {
        console.error('Error extracting from unknown host:', error);
        videoUrl = url;
      }
    }

    if (!videoUrl) {
      console.error('Could not extract video URL for:', url);
      return NextResponse.json({ url }); // Return original URL as fallback
    }

    console.log('Successfully extracted video URL:', videoUrl);
    return NextResponse.json({ url: videoUrl });
  } catch (error) {
    console.error('Error in video extraction:', error);
    try {
      // Try to get the original URL from the request
      const { url } = await request.json();
      if (url) {
        return NextResponse.json({ url }); // Return original URL as fallback
      }
    } catch {
      // If we can't get the original URL, return a generic error
    }
    return NextResponse.json({ error: 'Failed to process video URL' }, { status: 500 });
  }
} 