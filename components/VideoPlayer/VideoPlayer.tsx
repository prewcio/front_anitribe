"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, AlertCircle, Loader2 } from "lucide-react"
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
  quality?: string
}

function getVideoService(url: string): string | null {
  if (url.includes('cda.pl')) return 'cda'
  if (url.includes('vk.com')) return 'vk'
  if (url.includes('sibnet.ru')) return 'sibnet'
  if (url.includes('drive.google.com')) return 'gdrive'
  if (url.includes('mega.nz')) return 'mega'
  return null
}

async function fetchVideoUrl(sourceUrl: string, service: string): Promise<string> {
  try {
    const response = await fetch('/api/get-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: sourceUrl, service }),
    })

    if (!response.ok) throw new Error('Failed to fetch video URL')
    
    const data = await response.json()
    return data.videoUrl
  } catch (error) {
    console.error('Error fetching video URL:', error)
    throw error
  }
}

const PROGRESS_STORAGE_KEY = "anitribe-video-progress"

export function VideoPlayer({ src, poster, sections = [], animeId, episodeId, quality }: VideoPlayerProps) {
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
  const [isLoading, setIsLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  // Fetch video URL on mount or when src changes
  useEffect(() => {
    const fetchVideoSource = async () => {
      if (!src) return;
      
      setIsLoading(true)
      setError(null)
      
      try {
        console.log('Fetching video URL for:', src)
        const service = getVideoService(src)
        console.log('Detected video service:', service)
        
        const response = await fetch('/api/video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            url: src,
            service: service || 'unknown'
          }),
          credentials: 'same-origin'
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Video URL response:', data)
        
        if (data.url) {
          // Validate the URL
          try {
            new URL(data.url)
            setVideoUrl(data.url)
            setError(null)
            setRetryCount(0) // Reset retry count on success
          } catch (e) {
            throw new Error('Invalid video URL received from server')
          }
        } else {
          throw new Error('No video URL in response')
        }
      } catch (err) {
        console.error('Error fetching video URL:', err)
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(`Unable to load video: ${errorMessage}. ${retryCount < maxRetries ? 'Retrying...' : 'Max retries reached.'}`)
        
        // Implement retry logic with exponential backoff
        if (retryCount < maxRetries) {
          console.log(`Retrying video URL fetch (${retryCount + 1}/${maxRetries})...`)
          setRetryCount(prev => prev + 1)
          const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000) // Max 10 seconds
          setTimeout(() => {
            fetchVideoSource()
          }, backoffDelay)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideoSource()
  }, [src, retryCount, maxRetries])

  // Add error handling for video element
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleVideoError = (e: Event) => {
      const mediaError = (e.target as HTMLVideoElement).error
      let errorMessage = 'An error occurred while playing the video.'
      
      if (mediaError) {
        switch (mediaError.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = 'Video playback was aborted.'
            break
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = 'A network error occurred while loading the video.'
            break
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = 'The video format is not supported.'
            break
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'The video source is not supported.'
            break
        }
      }
      
      setError(errorMessage)
      setIsLoading(false)
    }

    video.addEventListener('error', handleVideoError)
    return () => video.removeEventListener('error', handleVideoError)
  }, [])

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch((e) => {
          console.error("Error playing video:", e)
          setError("Unable to play video. Please try again later.")
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
      videoRef.current.currentTime = endTime
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
    return sections.find((section) => currentTime >= section.start && currentTime < section.end) || null
  }

  if (isLoading) {
    return (
      <div className="relative bg-black aspect-video flex items-center justify-center">
        <div className="text-white text-center">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin" />
          <p>Loading video{retryCount > 0 ? ` (Attempt ${retryCount}/${maxRetries})` : ''}...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative bg-black aspect-video flex items-center justify-center">
        <div className="text-white text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
          {retryCount < maxRetries && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setRetryCount(prev => prev + 1)}
            >
              Retry
            </Button>
          )}
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
          src={videoUrl || undefined}
          poster={poster}
          className="w-full h-full"
          onClick={togglePlay}
          preload="metadata"
          crossOrigin="anonymous"
          onLoadedMetadata={(e) => {
            const video = e.target as HTMLVideoElement
            setDuration(video.duration)
            setCurrentTime(video.currentTime)
          }}
          onError={(e) => {
            console.error('Video loading error:', e)
            setError("Unable to load video. The source might be unavailable or restricted.")
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
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300",
          "p-4 md:p-4 p-2",
          showControls ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Custom Progress Bar */}
        <div
          className="relative w-full mb-2 md:mb-4 h-0.5 md:h-1 group cursor-pointer"
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
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 md:w-3 md:h-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform"
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
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-4 w-4 md:h-6 md:w-6" /> : <Play className="h-4 w-4 md:h-6 md:w-6" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10" onClick={() => handleSkip(-5)}>
              <SkipBack className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10" onClick={() => handleSkip(5)}>
              <SkipForward className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-4 w-4 md:h-5 md:w-5" /> : <Volume2 className="h-4 w-4 md:h-5 md:w-5" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                max={100}
                step={1}
                className="w-16 md:w-24"
                onValueChange={([value]) => handleVolumeChange(value / 100)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <span className="text-[10px] md:text-sm whitespace-nowrap">
              {formatTime(currentTime)}&nbsp;/&nbsp;{formatTime(duration)}
            </span>
            <PlayerSettings currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize className="h-4 w-4 md:h-5 md:w-5" /> : <Maximize className="h-4 w-4 md:h-5 md:w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

