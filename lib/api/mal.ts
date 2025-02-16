import { cache } from './cache';

// Initialize MAL client ID from environment variable
const MAL_CLIENT_ID = process.env.NEXT_PUBLIC_MAL_CLIENT_ID;
if (!MAL_CLIENT_ID) {
  console.warn('MAL_CLIENT_ID is not set in environment variables');
}

export async function fetchMAL(endpoint: string, params: Record<string, string> = {}) {
  if (!MAL_CLIENT_ID) {
    throw new Error('MAL Client ID not configured. Please set NEXT_PUBLIC_MAL_CLIENT_ID in your environment variables.');
  }

  // Remove undefined/null values from params
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null)
  );

  // Create a new URLSearchParams for the request
  const searchParams = new URLSearchParams(cleanParams);
  
  // Remove leading slash from endpoint if present and add it to params
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  searchParams.append('endpoint', cleanEndpoint);

  // Get the base URL based on environment
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'http://localhost:3000';

  // Construct the full URL
  const url = new URL('/api/mal', baseUrl);
  url.search = searchParams.toString();

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MAL API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: url.toString(),
        endpoint,
        params: cleanParams,
        body: errorText,
      });
      throw new Error(`MAL API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error('Error fetching from MAL:', {
      error,
      endpoint,
      params: cleanParams,
    });
    throw error;
  }
}

export async function searchAnime(query: string) {
  const fields = 'id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_episodes,media_type,status,genres,studios,source,average_episode_duration,start_season';
  const data = await fetchMAL('/anime', {
    q: query,
    fields,
    limit: '10',
  });

  return data.data.map(transformMALAnime);
}

export async function getAnimeDetails(id: number) {
  const cacheKey = `anime:${id}`;
  const cached = cache.get(cacheKey);
  if (cached?.data && Date.now() - cached.timestamp < 5 * 60 * 1000) {
    return cached.data;
  }

  try {
    const fields = 'id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_episodes,media_type,status,genres,studios,source,related_anime,recommendations,characters,average_episode_duration,start_season';
    
    // Construct the endpoint without a leading slash
    const data = await fetchMAL(`anime/${id}`, { fields });
    
    if (!data) {
      throw new Error('No data returned from MAL API');
    }

    const transformedData = transformMALAnime(data);

    cache.set(cacheKey, {
      data: transformedData,
      timestamp: Date.now(),
    });

    return transformedData;
  } catch (error) {
    console.error('Error fetching anime details:', error);
    throw error;
  }
}

export function transformMALAnime(malData: any) {
  return {
    id: malData.id,
    title: {
      romaji: malData.title,
      english: malData.alternative_titles?.en,
      native: malData.alternative_titles?.ja,
    },
    description: malData.synopsis,
    coverImage: {
      large: malData.main_picture?.large,
      medium: malData.main_picture?.medium,
    },
    format: transformMediaType(malData.media_type),
    episodes: malData.num_episodes,
    duration: malData.average_episode_duration ? Math.floor(malData.average_episode_duration / 60) : null,
    status: transformStatus(malData.status),
    startDate: parseDate(malData.start_date),
    endDate: parseDate(malData.end_date),
    season: malData.start_season?.season,
    seasonYear: malData.start_season?.year,
    averageScore: malData.mean ? Math.round(malData.mean * 10) : null,
    genres: malData.genres?.map((g: any) => g.name) || [],
    studios: malData.studios?.map((s: any) => ({
      id: s.id,
      name: s.name,
    })) || [],
    characters: malData.characters?.map(transformCharacter) || [],
    relations: malData.related_anime?.map((relation: any) => ({
      relationType: relation.relation_type_formatted,
      node: {
        id: relation.node.id,
        title: {
          romaji: relation.node.title,
          english: relation.node.alternative_titles?.en || null,
          native: relation.node.alternative_titles?.ja || null,
        },
        coverImage: {
          large: relation.node.main_picture?.large,
          medium: relation.node.main_picture?.medium,
        },
      }
    })) || [],
    recommendations: malData.recommendations?.map((rec: any) => ({
      mediaRecommendation: {
        id: rec.node.id,
        title: {
          romaji: rec.node.title,
        },
        coverImage: {
          large: rec.node.main_picture?.large,
          medium: rec.node.main_picture?.medium,
        },
        averageScore: rec.node.mean ? Math.round(rec.node.mean * 10) : null,
      }
    })) || [],
  };
}

function transformMediaType(type: string) {
  const typeMap: Record<string, string> = {
    tv: 'TV',
    movie: 'MOVIE',
    ova: 'OVA',
    ona: 'ONA',
    special: 'SPECIAL',
    music: 'MUSIC',
  };
  return typeMap[type.toLowerCase()] || type.toUpperCase();
}

function transformStatus(status: string) {
  const statusMap: Record<string, string> = {
    finished_airing: 'FINISHED',
    currently_airing: 'RELEASING',
    not_yet_aired: 'NOT_YET_RELEASED',
  };
  return statusMap[status] || status.toUpperCase();
}

function parseDate(dateStr: string | null) {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  return { year, month, day };
}

function transformCharacter(char: any) {
  return {
    node: {
      id: char.id,
      name: {
        full: char.name,
      },
      image: {
        large: char.pictures?.large,
      },
    },
    role: char.role?.toUpperCase(),
  };
}

function transformRelation(rel: any) {
  return {
    relationType: rel.relation_type?.toUpperCase(),
    node: transformMALAnime(rel.node),
  };
}

function transformRecommendation(rec: any) {
  return {
    mediaRecommendation: transformMALAnime(rec.node),
  };
}

export async function getPopularAnime() {
  const fields = 'id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_episodes,media_type,status,genres,studios,source,average_episode_duration,start_season';
  const data = await fetchMAL('/anime/ranking', {
    ranking_type: 'bypopularity',
    limit: '20',
    fields,
  });

  return data.data.map((item: any) => transformMALAnime(item.node));
}

export async function getSeasonalAnime() {
  const currentYear = new Date().getFullYear();
  const currentSeason = getCurrentSeason();
  
  const fields = 'id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_episodes,media_type,status,genres,studios,source,average_episode_duration,start_season';
  const data = await fetchMAL('/anime/season/' + currentYear + '/' + currentSeason, {
    limit: '20',
    fields,
  });

  return data.data.map((item: any) => transformMALAnime(item.node));
}

export function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
}

export async function getUpcomingAnime() {
  const fields = 'id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_episodes,media_type,status,genres,studios,source,average_episode_duration,start_season';
  const data = await fetchMAL('/anime/season/upcoming', {
    limit: '20',
    fields,
  });

  return data.data.map((item: any) => transformMALAnime(item));
}

export async function getFeaturedAnime() {
  const fields = 'id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_episodes,media_type,status,genres,studios,source,average_episode_duration,start_season';
  const data = await fetchMAL('/anime/ranking', {
    ranking_type: 'bypopularity',
    limit: '1',
    fields,
  });

  if (data.data.length > 0) {
    return transformMALAnime(data.data[0].node);
  }
  return null;
}

export interface BrowseFilters {
  sort?: string;
  genres?: string[];
  excludedGenres?: string[];
  year?: number;
  season?: string;
  page?: string;
}

export async function getAnimeByFilters(filters: BrowseFilters) {
  const fields = 'id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_episodes,media_type,status,genres,studios,source,average_episode_duration,start_season';
  
  let endpoint = '/anime';
  let params: Record<string, string> = { fields };

  if (filters.sort) {
    switch (filters.sort) {
      case 'POPULARITY_DESC':
        endpoint = '/anime/ranking';
        params.ranking_type = 'bypopularity';
        break;
      case 'SCORE_DESC':
        endpoint = '/anime/ranking';
        params.ranking_type = 'all';
        break;
      case 'START_DATE_DESC':
        // MAL doesn't support this directly, we'll sort the results
        break;
    }
  }

  if (filters.season && filters.year) {
    endpoint = `/anime/season/${filters.year}/${filters.season.toLowerCase()}`;
  }

  if (filters.page) {
    const offset = ((parseInt(filters.page) - 1) * 20).toString();
    if (offset !== '0') {
      params.offset = offset;
    }
  }
  params.limit = '20';

  try {
    const data = await fetchMAL(endpoint, params);
    const media = data.data.map((item: any) => transformMALAnime(item.node || item));
    
    // Sort by start date if requested
    if (filters.sort === 'START_DATE_DESC') {
      media.sort((a: any, b: any) => {
        const dateA = a.startDate ? new Date(a.startDate.year, a.startDate.month - 1, a.startDate.day || 1).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate.year, b.startDate.month - 1, b.startDate.day || 1).getTime() : 0;
        return dateB - dateA;
      });
    }

    return {
      media,
      pageInfo: {
        hasNextPage: data.paging?.next !== undefined,
        total: data.paging?.total || media.length,
      },
    };
  } catch (error) {
    console.error('Error fetching anime by filters:', error);
    throw error;
  }
} 