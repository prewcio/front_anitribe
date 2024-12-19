import { create } from "zustand"

interface AuthState {
  isAuthenticated: boolean
  user: {
    username: string
    avatar: string
  } | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (username: string, password: string) => {
    // Mock login logic
    if (username === "test" && password === "password") {
      set({ isAuthenticated: true, user: { username: "AnimeWielbiciel", avatar: "/placeholder-user.jpg" } })
      return true
    }
    return false
  },
  logout: () => set({ isAuthenticated: false, user: null }),
}))

