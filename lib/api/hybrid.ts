import * as mal from './mal';
import { getAnimeDetails as getAniListDetails } from './anilist';
import { cache, CACHE_DURATION } from './cache';
import type { NextAiringEpisode, SortOption } from './types';
import { fetchMAL, transformMALAnime, getSeasonalAnime as getMALSeasonalAnime, getCurrentSeason as getMALCurrentSeason } from './mal';

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
        };
      };
      role: string;
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
    const anilistData = await getAniListDetails(malId, query);
    
    const combinedData = {
      ...malData,
      bannerImage: anilistData?.Media?.bannerImage || null,
      nextAiringEpisode: anilistData?.Media?.nextAiringEpisode || null,
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
  try {
    // Get featured anime from MAL
    const malData = await mal.getFeaturedAnime();
    if (!malData) return null;

    // Get AniList banner image
    const query = `
      query ($malId: Int) {
        Media(idMal: $malId, type: ANIME) {
          bannerImage
        }
      }
    `;
    
    try {
      const anilistData = await getAniListDetails(malData.id, query);
      return {
        ...malData,
        bannerImage: anilistData?.Media?.bannerImage || malData.coverImage?.large,
      };
    } catch (error) {
      console.error('Error getting AniList banner:', error);
      return {
        ...malData,
        bannerImage: malData.coverImage?.large,
      };
    }
  } catch (error) {
    console.error('Error getting featured anime:', error);
    return null;
  }
}

export async function getSeasonalAnime() {
  try {
    const data = await mal.getSeasonalAnime();
    
    // Get AniList data for each anime
    const enrichedData = await Promise.all(
      data.map(async (anime) => {
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

// Re-export other MAL functions
export const {
  searchAnime,
  getPopularAnime,
  getUpcomingAnime,
  getAnimeByFilters,
} = mal;

// Re-export types
export type { SortOption }; 