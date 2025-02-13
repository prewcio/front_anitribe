"use client"

import { User, UserSettings } from "@/lib/types/user"
import { ProfileSettings } from "./ProfileSettings"

interface ProfileSettingsWrapperProps {
  user: User
}

export function ProfileSettingsWrapper({ user }: ProfileSettingsWrapperProps) {
  const handleSaveSettings = async (settings: UserSettings) => {
    try {
      // Implementacja logiki zapisywania ustawień
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error("Błąd podczas zapisywania ustawień")
      }

      // Możesz dodać tutaj powiadomienie o sukcesie
      console.log("Zapisano ustawienia:", settings)
    } catch (error) {
      // Możesz dodać tutaj obsługę błędów
      console.error("Błąd:", error)
    }
  }

  return (
    <ProfileSettings 
      user={user}
      onSaveSettings={handleSaveSettings}
    />
  )
} 