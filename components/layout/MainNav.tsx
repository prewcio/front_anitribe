"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Compass, Play, Users, Trophy, LogIn, LogOut, Sun, Moon, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserProgress } from "@/components/user/UserProgress"
import { SearchDialog } from "@/components/search/SearchDialog"
import { useAuth } from "@/lib/hooks/useAuth"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"

export function MainNav() {
  const pathname = usePathname()
  const [showProgress, setShowProgress] = useState(false)
  const { isAuthenticated, user, login, logout } = useAuth()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const navItems = [
    { title: "Strona główna", href: "/", icon: Home },
    { title: "Odkrywaj", href: "/discover", icon: Compass },
    { title: "Moja lista", href: "/my-list", icon: Play },
    { title: "Społeczność", href: "/community", icon: Users },
    { title: "Osiągnięcia", href: "/achievements", icon: Trophy },
  ]

  const handleLogin = async () => {
    const success = await login("test", "password")
    if (success) {
      toast({ title: "Zalogowano pomyślnie", description: "Witaj z powrotem!" })
    } else {
      toast({
        title: "Błąd logowania",
        description: "Nieprawidłowe dane logowania",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    logout()
    toast({ title: "Wylogowano", description: "Do zobaczenia wkrótce!" })
  }

  if (!mounted) {
    return null
  }

  console.log("MainNav component rendered")

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
            >
              AniTribe
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "relative px-4 py-2",
                        isActive ? "text-purple-600 dark:text-purple-400" : "text-foreground",
                      )}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.title}
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <SearchDialog />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-foreground"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {isAuthenticated ? (
              <>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => setShowProgress(!showProgress)}
                  >
                    <Avatar>
                      <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} alt="Awatar użytkownika" />
                      <AvatarFallback>AU</AvatarFallback>
                    </Avatar>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
                  </Button>

                  {showProgress && <UserProgress className="absolute top-full right-0 mt-2" />}
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/profile">
                    <User className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleLogin} className="text-foreground">
                <LogIn className="w-4 h-4 mr-2" />
                Zaloguj się
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

