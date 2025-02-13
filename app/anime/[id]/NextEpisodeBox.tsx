"use client"

import { Clock } from "lucide-react"

interface NextEpisodeBoxProps {
  episode: number
  timeUntilAiring: number
}

export function NextEpisodeBox({ episode, timeUntilAiring }: NextEpisodeBoxProps) {
  const days = Math.floor(timeUntilAiring / (60 * 60 * 24))
  const hours = Math.floor((timeUntilAiring % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((timeUntilAiring % (60 * 60)) / 60)

  return (
    <div className="w-full bg-[#1e1b2c] rounded-xl flex overflow-hidden">
      <div className="bg-purple-500/10 px-3 py-4 flex items-center">
        <Clock className="w-5 h-5 text-purple-400" />
      </div>
      
      <div className="flex-1 flex items-center justify-between px-4 py-3">
        <div className="flex flex-col">
          <span className="text-xs text-purple-400 font-medium">
            Następny odcinek
          </span>
          <span className="text-lg font-bold text-white mt-0.5">
            #{episode}
          </span>
        </div>

        <div className="flex items-center gap-5">
          {days > 0 && (
            <>
              <div className="text-center">
                <p className="text-xl font-bold text-white">
                  {days}
                </p>
                <p className="text-[10px] text-purple-400 uppercase mt-0.5">dni</p>
              </div>
              <div className="w-1 h-1 rounded-full bg-purple-500/30" />
            </>
          )}
          <div className="text-center">
            <p className="text-xl font-bold text-white">
              {hours}
            </p>
            <p className="text-[10px] text-purple-400 uppercase mt-0.5">godz</p>
          </div>
          <div className="w-1 h-1 rounded-full bg-purple-500/30" />
          <div className="text-center">
            <p className="text-xl font-bold text-white">
              {minutes}
            </p>
            <p className="text-[10px] text-purple-400 uppercase mt-0.5">min</p>
          </div>
        </div>
      </div>
    </div>
  )
}

