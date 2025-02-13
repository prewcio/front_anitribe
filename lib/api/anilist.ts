const API_URL = "https://graphql.anilist.co"

const GENRE_TAGS = new Set([
  'Action', 'Adventure', 'Comedy', 'Drama', 'Ecchi', 'Fantasy', 'Horror',
  'Mahou Shoujo', 'Mecha', 'Music', 'Mystery', 'Psychological', 'Romance',
  'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller', 'Hentai'
]);

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

export async function getAnimeDetails(id: number) {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
        }
        bannerImage
        description
        episodes
        status
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        season
        seasonYear
        format
        duration
        genres
        tags {
          name
          description
        }
        studios {
          nodes {
            name
          }
        }
        characters(sort: ROLE) {
          edges {
            node {
              id
              name {
                full
              }
              image {
                medium
              }
            }
            role
          }
        }
        recommendations {
          nodes {
            mediaRecommendation {
              id
              title {
                romaji
                english
              }
              coverImage {
                medium
              }
            }
          }
        }
        nextAiringEpisode {
          episode
          timeUntilAiring
        }
      }
    }
  `

  const data = await fetchAniList(query, { id })
  return data.Media
}

export type SortOption = "POPULARITY_DESC" | "SCORE_DESC" | "TRENDING_DESC" | "START_DATE_DESC"

export async function getAnimeByFilters(variables: {
  page: string
  sort: SortOption
  genres?: string[]
  excludedGenres?: string[]
  year?: number
  format?: string[]
  status?: string
}) {
  const query = `
    query ($page: Int, $sort: [MediaSort], $genres: [String], $tags: [String], $genre_not_in: [String], $tag_not_in: [String], $year: Int, $format: [MediaFormat], $status: MediaStatus) {
      Page(page: $page, perPage: 40) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(sort: $sort, genre_in: $genres, tag_in: $tags, genre_not_in: $genre_not_in, tag_not_in: $tag_not_in, seasonYear: $year, 
          format_in: $format, status: $status, type: ANIME, isAdult: false) {
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
          }
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
      ...(variables.year && variables.year <= new Date().getFullYear() + 1 && { year: variables.year }),
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

