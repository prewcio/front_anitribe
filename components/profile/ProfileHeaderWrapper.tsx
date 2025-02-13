"use client"

import { User } from "@/lib/types/user"
import { ProfileHeader } from "./ProfileHeader"

interface ProfileHeaderWrapperProps {
  user: User
  isOwnProfile: boolean
}

export function ProfileHeaderWrapper({ user, isOwnProfile }: ProfileHeaderWrapperProps) {
  const handleAddFriend = async () => {
    try {
      const response = await fetch(`/api/friends/add/${user.id}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Błąd podczas dodawania znajomego")
      }

      // Możesz dodać tutaj powiadomienie o sukcesie
      console.log("Dodano znajomego:", user.username)
    } catch (error) {
      // Możesz dodać tutaj obsługę błędów
      console.error("Błąd:", error)
    }
  }

  const handleMessage = () => {
    // Tutaj możesz zaimplementować otwieranie okna czatu lub przekierowanie do wiadomości
    console.log("Otwieranie czatu z:", user.username)
  }

  return (
    <ProfileHeader 
      user={user}
      isOwnProfile={isOwnProfile}
      onAddFriend={handleAddFriend}
      onMessage={handleMessage}
    />
  )
} 