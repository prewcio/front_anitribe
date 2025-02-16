export type SortOption = "POPULARITY_DESC" | "SCORE_DESC" | "TRENDING_DESC" | "START_DATE_DESC";

export interface AnimeTitle {
  romaji: string;
  english: string | null;
  native: string | null;
}

export interface CoverImage {
  large: string;
  medium: string;
}

export interface Character {
  node: {
    id: number;
    name: {
      full: string;
    };
    image: {
      large: string;
    };
  };
  role: string;
}

export interface NextAiringEpisode {
  episode: number;
  timeUntilAiring: number;
}

export interface AnimeDetails {
  id: number;
  title: AnimeTitle;
  description: string;
  coverImage: CoverImage;
  bannerImage: string | null;
  format: string;
  episodes: number;
  status: string;
  startDate: { year: number; month: number; day: number } | null;
  endDate: { year: number; month: number; day: number } | null;
  averageScore: number | null;
  genres: string[];
  studios: { id: number; name: string }[];
  characters: Character[];
  relations: {
    relationType: string;
    node: AnimeDetails;
  }[];
  recommendations: {
    mediaRecommendation: AnimeDetails;
  }[];
  nextAiringEpisode?: NextAiringEpisode | null;
} 