export const themes = {
  dark: {
    class: "dark",
    background: "hsl(222.2 84% 4.9%)",
    foreground: "hsl(210 40% 98%)",
    muted: "hsl(217.2 32.6% 17.5%)",
    border: "hsl(217.2 32.6% 17.5%)",
    primary: "hsl(210 40% 98%)",
    "primary-foreground": "hsl(222.2 47.4% 11.2%)",
    accent: "hsl(217.2 32.6% 17.5%)",
    "accent-foreground": "hsl(210 40% 98%)",
    secondary: "hsl(217.2 32.6% 17.5%)",
    "secondary-foreground": "hsl(210 40% 98%)",
    ring: "hsl(212.7 26.8% 83.9%)",
  },
  light: {
    class: "light",
    background: "hsl(0 0% 100%)",
    foreground: "hsl(222.2 84% 4.9%)",
    muted: "hsl(210 40% 96.1%)",
    border: "hsl(214.3 31.8% 91.4%)",
    primary: "hsl(222.2 47.4% 11.2%)",
    "primary-foreground": "hsl(210 40% 98%)",
    accent: "hsl(210 40% 96.1%)",
    "accent-foreground": "hsl(222.2 47.4% 11.2%)",
    secondary: "hsl(210 40% 96.1%)",
    "secondary-foreground": "hsl(222.2 47.4% 11.2%)",
    ring: "hsl(215 20.2% 65.1%)",
  },
} as const

export type Theme = typeof themes.dark

