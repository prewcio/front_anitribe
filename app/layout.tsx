import { Inter as FontSans } from "next/font/google"
import { MainNav } from "@/components/layout/MainNav"
import { ThemeProvider } from "@/components/ThemeProvider"
import { AuthProvider } from "@/lib/hooks/useAuth"
import { cn } from "@/lib/utils"
import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { MobileNav } from "@/components/layout/MobileNav"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <MainNav />
            <main className="container mx-auto px-4 pt-20 pb-16 sm:pb-20">{children}</main>
            <MobileNav />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
