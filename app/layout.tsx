import { Inter } from "next/font/google"
import { MainNav } from "@/components/layout/MainNav"
import { ThemeProvider } from "@/components/ThemeProvider"
import { AuthProvider } from "@/lib/hooks/useAuth"
import { cn } from "@/lib/utils"
import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { MobileNav } from "@/components/layout/MobileNav"
import type { Metadata } from "next"
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: {
    default: "AniTribe - Oglądaj anime online",
    template: "%s | AniTribe"
  },
  description: "Oglądaj anime online w najlepszej jakości. Dołącz do społeczności miłośników anime!",
  keywords: ["anime", "streaming", "polska", "odcinki", "online"],
  metadataBase: new URL("https://anitribe.pl"),
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://anitribe.pl",
    title: "AniTribe",
    description: "Oglądaj anime online w najlepszej jakości. Dołącz do społeczności miłośników anime!",
    siteName: "AniTribe"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <MainNav />
              <main className="flex-1 pt-16 pb-16 sm:pb-20">{children}</main>
              <MobileNav />
              <Toaster />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
