import * as mal from './mal';
import { getAnimeDetails as getAniListDetails, getAnimeCharactersByName } from './anilist';
import { cache, CACHE_DURATION } from './cache';
import type { NextAiringEpisode, SortOption } from './types';
import { fetchMAL, transformMALAnime, getSeasonalAnime as getMALSeasonalAnime, getCurrentSeason as getMALCurrentSeason } from './mal';
import { getShindenDescription } from '@/lib/utils/shindenDescription';

// Map to store MAL to AniList ID mappings
const idMappingCache = new Map<number, number>();
const malToAniListMap = new Map<number, number>();

async function getAniListId(malId: number): Promise<number | null> {
  if (idMappingCache.has(malId)) {
    return idMappingCache.get(malId)!;
  }

  const query = `
    query ($malId: Int) {
      Media(idMal: $malId, type: ANIME) {
        id
      }
    }
  `;

  try {
    const data = await getAniListDetails(malId, query);
    if (data?.Media?.id) {
      idMappingCache.set(malId, data.Media.id);
      return data.Media.id;
    }
  } catch (error) {
    console.error('Error getting AniList ID:', error);
  }
  return null;
}

async function getAniListBannerImage(malId: number): Promise<string | null> {
  const cacheKey = `banner:${malId}`;
  const cached = cache.get(cacheKey);
  if (cached?.data && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const query = `
    query ($malId: Int) {
      Media(idMal: $malId, type: ANIME) {
        bannerImage
      }
    }
  `;

  try {
    const data = await getAniListDetails(malId, query);
    const bannerImage = data?.Media?.bannerImage || null;
    
    if (bannerImage) {
      cache.set(cacheKey, {
        data: bannerImage,
        timestamp: Date.now(),
      });
    }
    
    return bannerImage;
  } catch (error) {
    console.error('Error getting banner image:', error);
    return null;
  }
}

async function getNextEpisodeInfo(malId: number): Promise<NextAiringEpisode | null> {
  try {
    const data = await getAniListDetails(malId);
    return data?.nextAiringEpisode || null;
  } catch (error) {
    console.error('Error getting next episode info:', error);
    return null;
  }
}

interface VoiceActor {
  id: number;
  name: {
    full: string;
    native: string;
  };
  image: {
    medium: string;
  };
}

interface CharacterMedia {
  node: {
    idMal: number;
    title: {
      romaji: string;
      english: string | null;
      native: string | null;
    };
    coverImage: {
      medium: string;
    };
  };
  characterRole: string;
}

interface Character {
  node: {
    id: number;
    name: {
      full: string;
      native: string;
    };
    image: {
      medium: string;
      large: string;
    };
    media: {
      edges: CharacterMedia[];
    };
  };
  role: string;
  voiceActors: VoiceActor[];
}

export interface AnimeCharacter {
  node: {
    id: number;
    name: {
      full: string;
      native: string;
    };
    image: {
      large: string;
    };
  };
  role: string;
}

export interface AnimeDetails {
  id: number;
  title: {
    romaji: string;
    english: string | null;
    native: string;
  };
  type: string;
  episodes: number | null;
  status: string;
  description: string;
  genres: string[];
  averageScore: number;
  bannerImage: string | null;
  coverImage: string | null;
  characters: {
    edges: Array<{
      node: {
        id: number;
        name: {
          full: string;
          native: string;
        };
        image: {
          medium: string;
          large: string;
        };
        media: {
          edges: Array<{
            node: {
              id: number;
              title: {
                romaji: string;
                english: string | null;
                native: string | null;
              };
              coverImage: {
                medium: string;
              };
            };
            characterRole: string;
          }>;
        };
      };
      role: string;
      voiceActors: Array<{
        id: number;
        name: {
          full: string;
          native: string;
        };
        image: {
          medium: string;
        };
      }>;
    }>;
  };
  nextAiringEpisode?: NextAiringEpisode | null;
}

export function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'SPRING';
  if (month >= 6 && month <= 8) return 'SUMMER';
  if (month >= 9 && month <= 11) return 'FALL';
  return 'WINTER';
}

export async function getAnimeDetails(malId: number) {
  const cacheKey = `anime:${malId}`;
  const cached = cache.get(cacheKey);
  if (cached?.data && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  // Get MAL data first
  const malData = await mal.getAnimeDetails(malId);
  if (!malData) return null;

  // Try to get Shinden description
  const shindenDesc = await getShindenDescription(malData.title.romaji);
  
  // Use Shinden description if available, otherwise use original MAL description
  if (shindenDesc) {
    malData.description = shindenDesc;
  }

  // Get AniList data for additional fields
  const query = `
    query ($malId: Int) {
      Media(idMal: $malId, type: ANIME) {
        id
        bannerImage
        nextAiringEpisode {
          episode
          timeUntilAiring
        }
      }
    }
  `;

  try {
    const [anilistData, charactersData] = await Promise.all([
      getAniListDetails(malId, query),
      getAnimeCharactersByName(malData.title.romaji)
    ]);
    
    const characters = charactersData?.Media?.characters?.edges || [];

    const combinedData = {
      ...malData,
      bannerImage: anilistData?.Media?.bannerImage || null,
      nextAiringEpisode: anilistData?.Media?.nextAiringEpisode || null,
      characters: { edges: characters }
    };

    cache.set(cacheKey, {
      data: combinedData,
      timestamp: Date.now(),
    });

    return combinedData;
  } catch (error) {
    console.error('Error getting AniList data:', error);
    // Return MAL data even if AniList fails
    return malData;
  }
}

export async function getFeaturedAnime() {
  const query = `
    query {
      Page(page: 1, perPage: 10) {
        media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {
          idMal
          id
          title {
            romaji
            english
            native
          }
          bannerImage
          coverImage {
            large
          }
          description
          genres
          averageScore
          nextAiringEpisode {
            episode
            timeUntilAiring
          }
        }
      }
    }
  `;

  try {
    // Get the base URL based on environment
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/anilist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const trendingAnime = data.data?.Page?.media?.[0];

    if (!trendingAnime) {
      throw new Error('No trending anime found');
    }

    // Return the anime with MAL ID as the main ID
    return {
      id: trendingAnime.idMal,
      title: trendingAnime.title,
      bannerImage: trendingAnime.bannerImage,
      coverImage: trendingAnime.coverImage,
      description: trendingAnime.description,
      genres: trendingAnime.genres,
      averageScore: trendingAnime.averageScore,
      nextAiringEpisode: trendingAnime.nextAiringEpisode,
    };
  } catch (error) {
    console.error('Error getting featured anime:', error);
    throw error;
  }
}

interface SeasonalAnime {
  id: number;
  title: {
    romaji: string;
    english: string | null;
    native: string | null;
  };
  coverImage: {
    large: string;
  };
  nextAiringEpisode?: {
    episode: number;
    timeUntilAiring: number;
  } | null;
}

export async function getSeasonalAnime() {
  try {
    const data = await mal.getSeasonalAnime();
    
    // Get AniList data for each anime
    const enrichedData = await Promise.all(
      data.map(async (anime: SeasonalAnime) => {
        try {
          const query = `
            query ($malId: Int) {
              Media(idMal: $malId, type: ANIME) {
                nextAiringEpisode {
                  episode
                  timeUntilAiring
                }
              }
            }
          `;
          const anilistData = await getAniListDetails(anime.id, query);
          return {
            ...anime,
            nextAiringEpisode: anilistData?.Media?.nextAiringEpisode || null,
          };
        } catch (error) {
          console.error(`Error getting AniList data for anime ${anime.id}:`, error);
          return anime;
        }
      })
    );

    return {
      media: enrichedData,
      season: mal.getCurrentSeason().toUpperCase(),
      year: new Date().getFullYear(),
    };
  } catch (error) {
    console.error('Error fetching seasonal anime:', error);
    return {
      media: [],
      season: mal.getCurrentSeason().toUpperCase(),
      year: new Date().getFullYear(),
    };
  }
}

export interface AnimeSearchResult {
  id: number;
  title: {
    romaji: string;
    english: string | null;
    native: string | null;
  };
  coverImage: {
    large: string;
    medium: string;
  };
  format: string;
  episodes: number | null;
  status: string;
  startDate: {
    year: number | null;
    month: number | null;
    day: number | null;
  } | null;
  averageScore: number | null;
}

export interface BrowseFilters {
  page?: string;
  sort?: string;
  genres?: string[];
  year?: number;
  season?: string;
}

export interface AniListAnime {
  idMal: number;
  title: {
    romaji: string;
    english: string | null;
    native: string | null;
  };
  coverImage: {
    large: string;
    medium: string;
  };
  format: string;
  episodes: number | null;
  status: string;
  startDate: {
    year: number | null;
    month: number | null;
    day: number | null;
  } | null;
}

interface AniListBrowseAnime {
  idMal: number;
  title: {
    romaji: string;
    english: string | null;
    native: string | null;
  };
  coverImage: {
    large: string;
  };
  format: string;
  episodes: number | null;
  averageScore: number;
  startDate: {
    year: number | null;
    month: number | null;
    day: number | null;
  };
  season: string;
  seasonYear: number;
}

export async function getAnimeByFilters(variables: {
  page: string
  sort: SortOption
  genres?: string[]
  excludedGenres?: string[]
  tags?: string[]
  excludedTags?: string[]
  year?: number
  season?: string
  format?: string[]
  status?: string
}) {
  const query = `
    query ($page: Int, $sort: [MediaSort], $genres: [String], $excludedGenres: [String], $tags: [String], $excludedTags: [String], $year: Int, $season: MediaSeason, $format: [MediaFormat], $status: MediaStatus) {
      Page(page: $page, perPage: 40) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(sort: $sort, genre_in: $genres, genre_not_in: $excludedGenres, tag_in: $tags, tag_not_in: $excludedTags, 
          seasonYear: $year, season: $season, format_in: $format, status: $status, type: ANIME, isAdult: false) {
          idMal
          title {
            romaji
            english
            native
          }
          coverImage {
            large
          }
          format
          episodes
          averageScore
          startDate {
            year
            month
            day
          }
          season
          seasonYear
        }
      }
    }
  `;

  try {
    const vars: Record<string, any> = {
      page: parseInt(variables.page, 10) || 1,
      sort: variables.sort || "TRENDING_DESC",
    };

    // Only add non-empty arrays to the variables
    if (variables.genres?.length) vars.genres = variables.genres;
    if (variables.excludedGenres?.length) vars.excludedGenres = variables.excludedGenres;
    if (variables.tags?.length) vars.tags = variables.tags;
    if (variables.excludedTags?.length) vars.excludedTags = variables.excludedTags;
    if (variables.format?.length) vars.format = variables.format;
    if (variables.year) vars.year = variables.year;
    if (variables.season) vars.season = variables.season.toUpperCase();
    if (variables.status) vars.status = variables.status;
    
    // Get the base URL based on environment
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/anilist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: vars
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const page = data.data?.Page;

    if (page) {
      // Transform the media array to use MAL IDs
      return {
        ...page,
        media: page.media.map((anime: AniListBrowseAnime) => ({
          ...anime,
          id: anime.idMal // Replace AniList ID with MAL ID
        }))
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching anime by filters:', error);
    throw error;
  }
}

export async function searchAnime(query: string) {
  const anilistQuery = `
    query ($search: String) {
      Page(page: 1, perPage: 10) {
        media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
          idMal
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            medium
          }
          format
          episodes
          status
          startDate {
            year
            month
            day
          }
        }
      }
    }
  `;

  try {
    // Get the base URL based on environment
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/anilist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: anilistQuery,
        variables: { search: query }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const results = data.data?.Page?.media || [];

    // Get MAL ratings for each result
    const enrichedResults = await Promise.all(
      results.map(async (anime: AniListAnime) => {
        if (!anime.idMal) return null;

        try {
          const malData = await mal.getAnimeDetails(anime.idMal);
          return {
            id: anime.idMal,
            title: {
              romaji: anime.title.romaji,
              english: anime.title.english,
              native: anime.title.native,
            },
            coverImage: anime.coverImage,
            format: anime.format,
            episodes: anime.episodes,
            status: anime.status,
            startDate: anime.startDate,
            averageScore: malData?.averageScore || null,
          };
        } catch (error) {
          console.error(`Error fetching MAL data for anime ${anime.idMal}:`, error);
          return {
            id: anime.idMal,
            title: {
              romaji: anime.title.romaji,
              english: anime.title.english,
              native: anime.title.native,
            },
            coverImage: anime.coverImage,
            format: anime.format,
            episodes: anime.episodes,
            status: anime.status,
            startDate: anime.startDate,
            averageScore: null,
          };
        }
      })
    );

    return enrichedResults.filter(Boolean);
  } catch (error) {
    console.error('Error searching anime:', error);
    throw error;
  }
}

// Re-export other MAL functions
export const {
  searchAnime: malSearchAnime,
  getPopularAnime,
  getUpcomingAnime,
  getAnimeByFilters: malGetAnimeByFilters,
} = mal;

// Re-export types
export type { SortOption }; 