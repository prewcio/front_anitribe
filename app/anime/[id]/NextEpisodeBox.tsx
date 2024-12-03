"use client"

import { useEffect, useState } from "react"

interface NextEpisodeBoxProps {
  episode: number
  timeUntilAiring: number
}

export function NextEpisodeBox({ episode, timeUntilAiring }: NextEpisodeBoxProps) {
  const [timeLeft, setTimeLeft] = useState(timeUntilAiring)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (timeLeft <= 0) {
    return null
  }

  const days = Math.floor(timeLeft / (60 * 60 * 24))
  const hours = Math.floor((timeLeft % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((timeLeft % (60 * 60)) / 60)

  return (
    <div className="bg-accent p-3 rounded-lg shadow-md text-sm w-full max-w-[250px]">
      <h3 className="font-semibold mb-1 text-center">Następny odcinek</h3>
      <p className="font-bold mb-1 text-center">Odcinek {episode}</p>
      <p className="text-xs text-center">
        Za: {days}d {hours}h {minutes}m
      </p>
    </div>
  )
}

