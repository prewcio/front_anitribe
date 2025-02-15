export interface AnimeListItem {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  coverImage: {
    large: string;
  };
  averageScore: number;
  episodes: number;
  format: string;
  progress?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  joinDate: string;
  isDonator: boolean;
  customization: {
    avatarAnimation?: string;
    nicknameColor?: string;
    avatarBorder?: string;
  };
  stats: UserStats;
  badges: Badge[];
  friends: Friend[];
  settings: UserSettings;
  watchingAnime: AnimeListItem[];
  completedAnime: AnimeListItem[];
  plannedAnime: AnimeListItem[];
  recentActivity: ActivityItem[];
}

export interface UserStats {
  watchedEpisodes: number;
  watchTime: number;
  averageRating: number;
  favoriteGenres: string[];
  watching: number;
  completed: number;
  planned: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Friend {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'watching';
  lastActive: string;
}

export interface UserSettings {
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    activityFeedVisibility: 'public' | 'friends' | 'private';
    showWatchStatus: boolean;
    showOnlineStatus: boolean;
  };
  notifications: {
    friendRequests: boolean;
    messages: boolean;
    activityUpdates: boolean;
    animeUpdates: boolean;
  };
  theme: {
    prefersDark: boolean;
    accentColor: string;
  };
  preferences: {
    titleLanguage: 'romaji' | 'english' | 'native';
  };
  customization: {
    avatarAnimation?: string;
    nicknameColor?: string;
    avatarBorder?: string;
  };
}

export interface ActivityItem {
  id: string;
  type: 'watch' | 'rate' | 'comment' | 'post' | 'friend' | 'achievement' | 'status';
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  metadata?: {
    animeId?: string;
    animeName?: string;
    rating?: number;
    episodeNumber?: number;
    commentId?: string;
    postId?: string;
    achievementId?: string;
  };
} 