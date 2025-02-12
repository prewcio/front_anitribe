"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { PlayerSettings } from "./PlayerSettings"
import { PlayerContextMenu } from "./PlayerContextMenu"
import { playerThemes } from "./themes"
import type { PlayerTheme, VideoSection } from "./types"

interface VideoPlayerProps {
  src: string
  poster?: string
  sections?: VideoSection[]
  animeId: number
  episodeId: number
}

const PROGRESS_STORAGE_KEY = "anitribe-video-progress"

export function VideoPlayer({ src, poster, sections = [], animeId, episodeId }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredSection, setHoveredSection] = useState<VideoSection | null>(null)
  const [currentTheme, setCurrentTheme] = useState<PlayerTheme>(playerThemes[0])

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch((e) => {
          setError("Unable to play video. Please try again later.")
          console.error("Error playing video:", e)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])

  const handleVolumeChange = useCallback((newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }, [])

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const newMutedState = !isMuted
      videoRef.current.muted = newMutedState
      setIsMuted(newMutedState)
      if (!newMutedState && volume === 0) {
        handleVolumeChange(0.5)
      }
    }
  }, [isMuted, volume, handleVolumeChange])

  const handleSeek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  const handleSkip = useCallback((seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
      setCurrentTime(videoRef.current.currentTime)
    }
  }, [])

  const handleSkipSection = useCallback((endTime: number) => {
    if (videoRef.current) {
      videoRef.currentTime = endTime
      setCurrentTime(endTime)
    }
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }, [])

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { clientX, currentTarget } = e
      const { left, width } = currentTarget.getBoundingClientRect()
      const clickPosition = (clientX - left) / width

      if (clickPosition < 0.3) {
        handleSkip(-5)
      } else if (clickPosition > 0.7) {
        handleSkip(5)
      } else {
        toggleFullscreen()
      }
    },
    [handleSkip, toggleFullscreen],
  )

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => {
      setCurrentTime(video.currentTime)
      if (video.duration !== duration) {
        setDuration(video.duration)
      }
    }

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("durationchange", () => setDuration(video.duration))
    video.addEventListener("loadedmetadata", () => setDuration(video.duration))

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("durationchange", () => setDuration(video.duration))
      video.removeEventListener("loadedmetadata", () => setDuration(video.duration))
    }
  }, [duration])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const handleMouseMove = () => {
      setShowControls(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => setShowControls(false), 3000)
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove)
      }
      clearTimeout(timeout)
    }
  }, [])

  // Load saved progress
  useEffect(() => {
    const savedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY)
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      if (progress.animeId === animeId && progress.episodeId === episodeId) {
        handleSeek(progress.timestamp)
      }
    }
  }, [animeId, episodeId, handleSeek])

  // Save progress periodically
  useEffect(() => {
    const saveProgress = () => {
      const progress = {
        animeId,
        episodeId,
        timestamp: currentTime,
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress))
    }

    const interval = setInterval(saveProgress, 5000) // Save every 5 seconds
    return () => clearInterval(interval)
  }, [animeId, episodeId, currentTime])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getCurrentSection = () => {
    return sections.find((section) => currentTime >= section.start && currentTime < section.end)
  }

  if (error) {
    return (
      <div className="relative bg-black aspect-video flex items-center justify-center">
        <div className="text-white text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </div>
    )
  }

  const currentSection = getCurrentSection()

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-black group",
        isFullscreen ? "fixed inset-0 z-50" : "w-full aspect-video",
        currentTheme.className,
      )}
      onDoubleClick={handleDoubleClick}
    >
      <PlayerContextMenu>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full"
          onClick={togglePlay}
          preload="metadata"
          onLoadedMetadata={(e) => {
            const video = e.target as HTMLVideoElement
            setDuration(video.duration)
            setCurrentTime(video.currentTime)
          }}
        />
      </PlayerContextMenu>

      {/* Section name overlay and skip button */}
      {currentSection && (
        <div className="absolute top-4 left-0 right-0 px-4 flex justify-between items-center">
          <div className="bg-black/50 px-3 py-1.5 rounded text-sm text-white">{currentSection.name}</div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleSkipSection(currentSection.end)}
            className="text-xs bg-black/50 hover:bg-black/75 text-white"
          >
            Skip
          </Button>
        </div>
      )}

      {/* Controls */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Custom Progress Bar */}
        <div
          className="relative w-full mb-4 h-1 group cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const pos = (e.clientX - rect.left) / rect.width
            handleSeek(pos * duration)
          }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-white/20">
            {/* Sections */}
            {sections.map((section, index) => (
              <div
                key={index}
                className="absolute h-full"
                style={{
                  backgroundColor: section.color,
                  left: `${duration ? (section.start / duration) * 100 : 0}%`,
                  width: `${duration ? ((section.end - section.start) / duration) * 100 : 0}%`,
                  opacity: hoveredSection === section ? 1 : 0.7,
                }}
                onMouseEnter={() => setHoveredSection(section)}
                onMouseLeave={() => setHoveredSection(null)}
              />
            ))}
            {/* Progress */}
            <div
              className="absolute h-full bg-white"
              style={{
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              }}
            />
          </div>

          {/* Thumb indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform"
            style={{
              left: `${duration ? (currentTime / duration) * 100 : 0}%`,
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Hover time indicator */}
          {hoveredSection && (
            <div className="absolute -top-8 left-4 bg-black/50 px-2 py-1 rounded text-xs text-white">
              {hoveredSection.name}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleSkip(-5)}>
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleSkip(5)}>
              <SkipForward className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                max={100}
                step={1}
                className="w-24"
                onValueChange={([value]) => handleVolumeChange(value / 100)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <PlayerSettings currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
            <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

