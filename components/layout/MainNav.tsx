"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Compass, Play, Users, Trophy, LogIn, LogOut, Sun, Moon, User, Menu, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserProgress } from "@/components/user/UserProgress"
import { SearchDialog } from "@/components/search/SearchDialog"
import { useAuth } from "@/lib/hooks/useAuth"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function MainNav() {
  const pathname = usePathname()
  const [showProgress, setShowProgress] = useState(false)
  const { isAuthenticated, user, login, logout } = useAuth()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1210)
      if (window.innerWidth >= 1210) setSheetOpen(false)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => setMounted(true), [])

  const navItems = [
    { title: "Strona główna", href: "/", icon: Home },
    { title: "Odkrywaj", href: "/browse", icon: Compass },
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
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AniTribe
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
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
            
            <div className="hidden custom-lg:flex items-center gap-1">
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

          <div className="custom-lg:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-foreground"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} />
                    <AvatarFallback>{user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} />
                        <AvatarFallback>{user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user?.username || "Użytkownik"}</p>
                        <p className="text-sm text-muted-foreground">
                          {user ? `Poziom ${user.level || 1}` : "Poziom 1"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium">Postęp XP</span>
                        <span className="text-muted-foreground">
                          {user ? `${user.xp || 0} / 4,000 XP` : "0 / 4,000 XP"}
                        </span>
                      </div>
                      <div className="w-full bg-accent/50 h-2 rounded-full">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(((user?.xp || 0) / 4000) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-b border-border">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm font-medium">12</p>
                        <p className="text-xs text-muted-foreground">Oglądam</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">86</p>
                        <p className="text-xs text-muted-foreground">Ukończone</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">1,432</p>
                        <p className="text-xs text-muted-foreground">Odcinki</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto">
                    <div className="p-2">
                      <Link 
                        href="/profile" 
                        className="flex items-center p-2.5 rounded-md hover:bg-accent"
                        onClick={() => setSheetOpen(false)}
                      >
                        <User className="mr-2.5 h-4 w-4" />
                        <span>Profil</span>
                      </Link>
                      <Link 
                        href="/notifications" 
                        className="flex items-center justify-between w-full p-2.5 rounded-md hover:bg-accent"
                        onClick={() => setSheetOpen(false)}
                      >
                        <div className="flex items-center">
                          <Bell className="mr-2.5 h-4 w-4" />
                          <span>Powiadomienia</span>
                        </div>
                        <span className="bg-purple-600/10 text-purple-600 text-xs font-medium px-2 py-0.5 rounded-full">3</span>
                      </Link>
                    </div>
                  </div>

                  <div className="p-4 border-t border-border">
                    {isAuthenticated ? (
                      <Button variant="destructive" className="w-full" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Wyloguj
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={handleLogin}>
                        <LogIn className="mr-2 h-4 w-4" />
                        Zaloguj
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden custom-lg:flex items-center gap-4">
            <SearchDialog />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} />
                    <AvatarFallback>{user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[280px] p-0">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} />
                      <AvatarFallback>{user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div>
                        <p className="text-sm font-medium">{user?.username || "Użytkownik"}</p>
                        <p className="text-xs text-muted-foreground">
                          {user ? `Poziom ${user.level || 1}` : "Poziom 1"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium">Postęp XP</span>
                      <span className="text-muted-foreground">
                        {user ? `${user.xp || 0} / 4,000 XP` : "0 / 4,000 XP"}
                      </span>
                    </div>
                    <div className="w-full bg-accent/50 h-2 rounded-full">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(((user?.xp || 0) / 4000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 border-b border-border">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm font-medium">12</p>
                      <p className="text-xs text-muted-foreground">Oglądam</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">86</p>
                      <p className="text-xs text-muted-foreground">Ukończone</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">1,432</p>
                      <p className="text-xs text-muted-foreground">Odcinki</p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <DropdownMenuItem asChild className="p-2.5">
                    <Link href="/profile" className="cursor-pointer flex items-center">
                      <User className="mr-2.5 h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-2.5">
                    <Link href="/notifications" className="cursor-pointer flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <Bell className="mr-2.5 h-4 w-4" />
                        <span>Powiadomienia</span>
                      </div>
                      <span className="bg-purple-600/10 text-purple-600 text-xs font-medium px-2 py-0.5 rounded-full">3</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem onClick={handleLogout} className="p-2.5 cursor-pointer text-red-500 hover:text-red-600">
                    <LogOut className="mr-2.5 h-4 w-4" />
                    <span>Wyloguj</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-foreground"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

