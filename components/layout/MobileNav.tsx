"use client"

import { Home, Compass, Play, Trophy, Bell, User, LogIn, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/hooks/useAuth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export function MobileNav() {
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuth()
  const { theme, setTheme } = useTheme()
  const navItems = [
    { title: "Strona Główna", href: "/", icon: Home },
    { title: "Przeglądaj", href: "/browse", icon: Compass },
    { title: "Moja Lista", href: "/my-list", icon: Play },
    { title: "Osiągnięcia", href: "/achievements", icon: Trophy },
  ]

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] sm:hidden z-50"
    >
      <div className="relative bg-background/80 backdrop-blur-lg rounded-2xl border border-purple-300/20 shadow-xl">
        <div className="flex justify-around p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center p-2 text-sm transition-all",
                pathname === item.href 
                  ? "text-purple-600 scale-110" 
                  : "text-foreground hover:text-purple-400"
              )}
            >
              <item.icon className="h-7 w-7 mb-1" />
              <span className="text-xs">{item.title}</span>
            </Link>
          ))}
        </div>
        
        {/* Account Section */}
        <div className="absolute -top-14 right-2 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-foreground"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {isAuthenticated ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-12 w-12 border-2 border-purple-500">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user?.username || "Profil"}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-red-500 hover:bg-red-500/10"
                onClick={() => {/* Add logout logic */}}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Wyloguj
              </Button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
              <User className="h-12 w-12 p-2 rounded-full bg-purple-100/50 border-2 border-purple-300" />
              <span className="text-sm font-medium">Zaloguj</span>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
} 