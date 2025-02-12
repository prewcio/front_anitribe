"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Player {
  id: string
  name: string
  language: string
}

interface PlayerSelectorProps {
  players: Player[]
}

export function PlayerSelector({ players }: PlayerSelectorProps) {
  const [currentPlayer, setCurrentPlayer] = useState<string>(players[0]?.id || "")

  const handlePlayerChange = (playerId: string) => {
    setCurrentPlayer(playerId)
    // Here you would update the current player in your database or state management system
    console.log(`Changing player to: ${playerId}`)
    // For now, we'll just log the change. In a real application, you'd update the state and re-render with the new player.
  }

  return (
    <div className="w-full sm:w-auto">
      <Select value={currentPlayer} onValueChange={handlePlayerChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Wybierz player" />
        </SelectTrigger>
        <SelectContent>
          {players.map((player) => (
            <SelectItem key={player.id} value={player.id}>
              {player.name} ({player.language})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

