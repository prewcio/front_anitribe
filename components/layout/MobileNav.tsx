"use client"

import { Home, Compass, Play, Users, Trophy } from "lucide-react"
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
    { title: "Strona", href: "/", icon: Home },
    { title: "Odkrywaj", href: "/browse", icon: Compass },
    { title: "Lista", href: "/my-list", icon: Play },
    { title: "Social", href: "/community", icon: Users },
    { title: "Trofea", href: "/achievements", icon: Trophy },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background sm:hidden">
      <nav className="container flex h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5",
                isActive ? "text-purple-600 dark:text-purple-400" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 