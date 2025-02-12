export const themeConfig = {
  colors: {
    // Dark, modern color palette
    background: {
      primary: "#0A0A0C",
      secondary: "#12121A",
      tertiary: "#1A1A24",
    },
    accent: {
      primary: "#6D28D9", // Purple
      secondary: "#4F46E5", // Indigo
      success: "#059669", // Emerald
      warning: "#D97706", // Amber
      danger: "#DC2626", // Red
    },
    text: {
      primary: "#F8FAFC",
      secondary: "#94A3B8",
      muted: "#475569",
    },
    border: {
      DEFAULT: "#1E293B",
      hover: "#334155",
    },
    // Achievement colors
    achievement: {
      bronze: "#B45309",
      silver: "#6B7280",
      gold: "#D97706",
      platinum: "#7C3AED",
      diamond: "#2DD4BF",
    },
    // User name colors
    username: {
      default: "#F8FAFC",
      moderator: "#4F46E5",
      admin: "#DC2626",
      premium: "#D97706",
      contributor: "#059669",
    },
  },
  borderRadius: {
    sm: "0.375rem",
    DEFAULT: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  },
  animation: {
    avatar: {
      default: "none",
      rare: "border-pulse-blue 2s infinite",
      epic: "border-pulse-purple 2s infinite",
      legendary: "border-pulse-gold 2s infinite",
    },
  },
}

export type ThemeConfig = typeof themeConfig

