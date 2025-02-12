"use client"

import { useRef, useCallback } from "react"
import type { VideoSection } from "./types"
import type React from "react" // Added import for React

interface VideoProgressProps {
  currentTime: number
  duration: number
  sections: VideoSection[]
  onSeek: (time: number) => void
}

export function VideoProgress({ currentTime, duration, sections, onSeek }: VideoProgressProps) {
  const progressRef = useRef<HTMLDivElement>(null)

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current) return

      const rect = progressRef.current.getBoundingClientRect()
      const percentage = (event.clientX - rect.left) / rect.width
      onSeek(percentage * duration)
    },
    [duration, onSeek],
  )

  return (
    <div ref={progressRef} className="h-1 bg-video-buffer cursor-pointer" onClick={handleClick}>
      {sections.map((section, index) => (
        <div
          key={index}
          className="absolute h-1 bg-yellow-500 opacity-50"
          style={{
            left: `${(section.start / duration) * 100}%`,
            width: `${((section.end - section.start) / duration) * 100}%`,
          }}
        />
      ))}
      <div className="h-full bg-video-progress" style={{ width: `${(currentTime / duration) * 100}%` }} />
    </div>
  )
}

