"use client"

import { useEffect, useRef } from "react"

interface InfiniteScrollProps {
  onLoadMore: () => void
  hasMore: boolean
  rootMargin?: string
}

export function InfiniteScroll({ onLoadMore, hasMore, rootMargin = "400px" }: InfiniteScrollProps) {
  const observerRef = useRef<IntersectionObserver>()
  const targetRef = useRef<HTMLDivElement>(null)
  const triggeredRef = useRef(false)

  useEffect(() => {
    if (!hasMore) return

    const marginValue = parseInt(rootMargin) || 10
    const checkVisibility = () => {
      if (!targetRef.current) return false
      const rect = targetRef.current.getBoundingClientRect()
      return rect.top <= window.innerHeight + marginValue
    }

    const loadIfVisible = () => {
      if (!triggeredRef.current && checkVisibility()) {
        triggeredRef.current = true
        onLoadMore()
      }
    }

    // Immediate check on mount
    loadIfVisible()

    // Set up intersection observer
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          triggeredRef.current = true
          onLoadMore()
        }
      },
      { rootMargin }
    )

    if (targetRef.current) {
      observerRef.current.observe(targetRef.current)
    }

    // Add scroll listener for immediate checks
    window.addEventListener('scroll', loadIfVisible)
    window.addEventListener('resize', loadIfVisible)

    return () => {
      observerRef.current?.disconnect()
      window.removeEventListener('scroll', loadIfVisible)
      window.removeEventListener('resize', loadIfVisible)
      triggeredRef.current = false
    }
  }, [hasMore, onLoadMore, rootMargin])

  return <div ref={targetRef} className="h-px w-full" />
}

