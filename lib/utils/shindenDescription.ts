import { cache } from "@/lib/api/cache";

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function getShindenDescription(title: string): Promise<string | null> {
  // Check cache first
  const cacheKey = `shinden:${title}`;
  const cached = cache.get(cacheKey);
  if (cached?.data && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Shinden description cache hit:', {
      title,
      descriptionLength: cached.data.length,
    });
    return cached.data;
  }

  try {
    console.log('Fetching Shinden description:', { title });
    
    // Get the base URL based on environment
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'http://localhost:3000';
      
    const response = await fetch(`${baseUrl}/api/shinden?title=${encodeURIComponent(title)}`);
    const result = await response.json();

    if (response.ok && result.status === 200 && result.shinden?.description) {
      console.log('Shinden description fetched successfully:', {
        title,
        descriptionLength: result.shinden.description.length,
      });
      
      // Cache the result
      cache.set(cacheKey, {
        data: result.shinden.description,
        timestamp: Date.now(),
      });

      return result.shinden.description;
    }
    
    console.log('No Shinden description found:', { title });
    return null;
  } catch (error) {
    console.error('Error fetching Shinden description:', error);
    return null;
  }
} 