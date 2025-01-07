"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { pl } from "./pl"

const languages = {
  pl,
} as const

type LanguageContextType = {
  language: keyof typeof languages
  translations: typeof pl
  setLanguage: (lang: keyof typeof languages) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<keyof typeof languages>("pl")

  const value = {
    language,
    translations: languages[language],
    setLanguage,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

