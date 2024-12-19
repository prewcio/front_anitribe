"use client"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  username: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already logged in (e.g., from localStorage)
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (username: string, password: string) => {
    // Mock login logic
    if (username === "test" && password === "password") {
      const user = { username: "AnimeWielbiciel", avatar: "/placeholder-user.jpg" }
      setUser(user)
      setIsAuthenticated(true)
      localStorage.setItem("user", JSON.stringify(user))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
  }

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

