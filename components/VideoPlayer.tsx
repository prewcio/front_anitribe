"use client"
import { useEffect, useState } from 'react'

export function VideoPlayer({ sourceUrl, sourceType }: { sourceUrl: string; sourceType: string }) {
  const [videoUrl, setVideoUrl] = useState('')

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`/api/video-proxy?url=${encodeURIComponent(sourceUrl)}&source=${sourceType}`)
        const data = await res.json()
        setVideoUrl(data.url)
      } catch (error) {
        console.error('Failed to load video:', error)
      }
    }
    
    fetchVideo()
  }, [sourceUrl, sourceType])

  return (
    <video key={videoUrl} controls className="w-full h-full">
      {videoUrl && <source src={videoUrl} type="video/mp4" />}
    </video>
  )
} 