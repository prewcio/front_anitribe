import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { formatTime } from "@/lib/utils"

interface VideoControlsProps {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  onPlayPause: () => void
  onSkipBackward: () => void
  onSkipForward: () => void
  onVolumeChange: (value: number) => void
  onToggleMute: () => void
  onFullscreen: () => void
  onPreviousEpisode?: () => void
  onNextEpisode?: () => void
}

export function VideoControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  onPlayPause,
  onSkipBackward,
  onSkipForward,
  onVolumeChange,
  onToggleMute,
  onFullscreen,
  onPreviousEpisode,
  onNextEpisode,
}: VideoControlsProps) {
  return (
    <div className="px-4 py-2 flex items-center gap-2">
      <div className="flex items-center gap-2">
        {onPreviousEpisode && (
          <Button variant="ghost" size="icon" onClick={onPreviousEpisode} className="text-white hover:bg-white/20">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        <Button variant="ghost" size="icon" onClick={onPlayPause} className="text-white hover:bg-white/20">
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>

        {onNextEpisode && (
          <Button variant="ghost" size="icon" onClick={onNextEpisode} className="text-white hover:bg-white/20">
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}

        <Button variant="ghost" size="icon" onClick={onSkipBackward} className="text-white hover:bg-white/20">
          <SkipBack className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" onClick={onSkipForward} className="text-white hover:bg-white/20">
          <SkipForward className="h-5 w-5" />
        </Button>

        <span className="text-white text-sm">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onToggleMute} className="text-white hover:bg-white/20">
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>

        <div className="w-24">
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            min={0}
            max={100}
            step={1}
            onValueChange={([value]) => onVolumeChange(value / 100)}
          />
        </div>

        <Button variant="ghost" size="icon" onClick={onFullscreen} className="text-white hover:bg-white/20">
          <Maximize className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

