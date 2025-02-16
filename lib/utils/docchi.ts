export interface DocchiPlayer {
  id: number;
  player: string;
  player_hosting: string;
  translator_title: string;
  quality?: string;
}

export function getSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function getEpisodePlayers(slug: string, episodeNumber: number): Promise<DocchiPlayer[]> {
  try {
    // Get the base URL based on environment
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'http://localhost:3000';
      
    const response = await fetch(
      `${baseUrl}/api/docchi/episodes/${encodeURIComponent(slug)}/${episodeNumber}`
    );

    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      throw new Error('Failed to fetch episode players');
    }

    const data = await response.json();
    console.log('Raw API response:', data);

    // The response is already an array of players
    if (Array.isArray(data)) {
      return data.map((player) => ({
        id: player.id,
        player: player.player,
        player_hosting: player.player_hosting,
        translator_title: player.translator_title,
        quality: undefined // The API doesn't provide quality information
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching episode players:', error);
    return [];
  }
} 