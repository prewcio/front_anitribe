const API_URL = "https://graphql.anilist.co"

const GENRE_TAGS = new Set([
  'Action', 'Adventure', 'Comedy', 'Drama', 'Ecchi', 'Fantasy', 'Horror',
  'Mahou Shoujo', 'Mecha', 'Music', 'Mystery', 'Psychological', 'Romance',
  'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller', 'Hentai'
]);

// Add cache implementation at the top of the file
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const cache = new Map<string, { data: any; timestamp: number }>();

async function fetchAniList(query: string, variables: any = {}) {
  try {
    console.log("Fetching from AniList API:", { query, variables })
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    if (!response.ok) {
      console.error("AniList API HTTP error:", response.status, response.statusText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json = await response.json()
    if (json.errors) {
      console.error("AniList API Error:", json.errors)
      throw new Error("Failed to fetch from AniList: " + json.errors[0].message)
    }

    console.log("AniList API response:", json.data)
    return json.data
  } catch (error) {
    console.error("Error fetching from AniList:", error)
    throw error
  }
}

export async function searchAnime(search: string) {
  console.log("Searching for anime:", search)
  const query = `
    query ($search: String) {
      Page(page: 1, perPage: 10) {
        media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            medium
          }
          format
          episodes
          status
          startDate {
            year
          }
        }
      }
    }
  `

  try {
    const data = await fetchAniList(query, { search })
    if (!data || !data.Page || !data.Page.media) {
      console.error("Invalid response from AniList API:", data)
      throw new Error("Invalid response from AniList API")
    }
    console.log("Search results:", data.Page.media)
    return data.Page.media
  } catch (error) {
    console.error("Error in searchAnime:", error)
    throw error
  }
}

export async function getAnimeDetails(malId: number, customQuery?: string) {
  const query = customQuery || `
    query ($malId: Int) {
      Media(idMal: $malId, type: ANIME) {
        id
        nextAiringEpisode {
          episode
          timeUntilAiring
        }
      }
    }
  `;

  const variables = { malId };

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching from AniList:', error);
    throw error;
  }
}

// Helper function to clear cache
export function clearAnimeCache() {
  cache.clear();
}

// Helper function to remove specific anime from cache
export function removeFromCache(id: number) {
  cache.delete(`anime:${id}`);
}

export type SortOption = "POPULARITY_DESC" | "SCORE_DESC" | "TRENDING_DESC" | "START_DATE_DESC"

export async function getAnimeByFilters(variables: {
  page: string
  sort: SortOption
  genres?: string[]
  excludedGenres?: string[]
  year?: number
  season?: string
  format?: string[]
  status?: string
}) {
  const query = `
    query ($page: Int, $sort: [MediaSort], $genres: [String], $tags: [String], $genre_not_in: [String], $tag_not_in: [String], $year: Int, $season: MediaSeason, $format: [MediaFormat], $status: MediaStatus) {
      Page(page: $page, perPage: 40) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(sort: $sort, genre_in: $genres, tag_in: $tags, genre_not_in: $genre_not_in, tag_not_in: $tag_not_in, 
          seasonYear: $year, season: $season, format_in: $format, status: $status, type: ANIME, isAdult: false) {
          id
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
  `

  // Split genres into official genres and regular tags
  const genreTags = variables.genres?.filter(g => GENRE_TAGS.has(g)) || []
  const otherTags = variables.genres?.filter(g => !GENRE_TAGS.has(g)) || []
  const excludedGenreTags = variables.excludedGenres?.filter(g => GENRE_TAGS.has(g)) || []
  const excludedOtherTags = variables.excludedGenres?.filter(g => !GENRE_TAGS.has(g)) || []

  try {
    const vars: Record<string, any> = {
      page: parseInt(variables.page, 10) || 1,
      sort: variables.sort || "TRENDING_DESC",
      ...(genreTags.length > 0 && { genres: genreTags }),
      ...(otherTags.length > 0 && { tags: otherTags }),
      ...(excludedGenreTags.length > 0 && { genre_not_in: excludedGenreTags }),
      ...(excludedOtherTags.length > 0 && { tag_not_in: excludedOtherTags }),
      ...(variables.year && { year: variables.year }),
      ...(variables.season && { season: variables.season }),
      ...(variables.format && variables.format.length > 0 && { format: variables.format }),
      ...(variables.status && { status: variables.status })
    }
    
    const data = await fetchAniList(query, vars)
    return data.Page
  } catch (error) {
    console.error("Error fetching anime by filters:", error)
    throw error
  }
}

export async function getCharacterDetails(id: number) {
  const query = `
    query ($id: Int) {
      Character(id: $id) {
        id
        name {
          full
          native
        }
        image {
          large
        }
        description
        gender
        dateOfBirth {
          year
          month
          day
        }
        age
        bloodType
        siteUrl
        media(sort: POPULARITY_DESC) {
          edges {
            node {
              id
              title {
                romaji
                english
                native
              }
              type
              format
              startDate {
                year
              }
              coverImage {
                medium
              }
            }
            characterRole
          }
        }
      }
    }
  `

  const data = await fetchAniList(query, { id })
  return data.Character
}

export async function getFeaturedAnime() {
  const query = `
    query {
      Page(page: 1, perPage: 5) {
        media(type: ANIME, sort: TRENDING_DESC, status: RELEASING) {
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
  `
  const data = await fetchAniList(query)
  return data.Page.media[0] // Return the most trending anime
}

export async function getCurrentSeason() {
  const now = new Date()
  const month = now.getMonth() + 1 // 0-based to 1-based
  let season = "WINTER"
  let year = now.getFullYear()

  if (month >= 3 && month <= 5) season = "SPRING"
  else if (month >= 6 && month <= 8) season = "SUMMER"
  else if (month >= 9 && month <= 11) season = "FALL"
  else if (month === 12) {
    season = "WINTER"
    year = year + 1
  }

  return { season, year }
}

export async function getNextSeason() {
  const current = await getCurrentSeason()
  let nextSeason = "SPRING"
  let nextYear = current.year

  switch (current.season) {
    case "WINTER":
      nextSeason = "SPRING"
      break
    case "SPRING":
      nextSeason = "SUMMER"
      break
    case "SUMMER":
      nextSeason = "FALL"
      break
    case "FALL":
      nextSeason = "WINTER"
      nextYear = current.year + 1
      break
  }

  return { season: nextSeason, year: nextYear }
}

export async function getSeasonalAnime(season?: string, year?: number) {
  const currentSeason = await getCurrentSeason()
  const targetSeason = season || currentSeason.season
  const targetYear = year || currentSeason.year

  const query = `
    query ($season: MediaSeason, $year: Int) {
      Page(page: 1, perPage: 10) {
        media(season: $season, seasonYear: $year, type: ANIME, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
          }
          averageScore
          format
          episodes
          nextAiringEpisode {
            episode
            timeUntilAiring
          }
        }
      }
    }
  `
  const data = await fetchAniList(query, { season: targetSeason, year: targetYear })
  return {
    media: data.Page.media,
    season: targetSeason,
    year: targetYear
  }
}

export async function getPopularAnime() {
  const query = `
    query {
      Page(page: 1, perPage: 10) {
        media(type: ANIME, sort: TRENDING_DESC) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
          }
          averageScore
          format
          episodes
        }
      }
    }
  `
  const data = await fetchAniList(query)
  return data.Page.media
}

export async function getUpcomingAnime() {
  const query = `
    query {
      Page(page: 1, perPage: 10) {
        media(type: ANIME, status: NOT_YET_RELEASED, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
          }
          startDate {
            year
            month
            day
          }
          format
          episodes
          genres
        }
      }
    }
  `
  const data = await fetchAniList(query)
  return data.Page.media
}

