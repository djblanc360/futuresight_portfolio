"use client"

import { useEffect, useState, useRef, useCallback } from "react"

interface Star {
  id: number
  x: number
  y: number
  size: number
  baseOpacity: number
  currentOpacity: number
  isFlickering: boolean
}

export function StarryBackground() {
  const [stars, setStars] = useState<Star[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const flickerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  useEffect(() => {
    if (dimensions.width === 0) return

    // Generate static stars
    const generateStars = () => {
      const newStars: Star[] = []
      const starCount = Math.floor((dimensions.width * dimensions.height) / 15000) // Less dense for better performance

      for (let i = 0; i < starCount; i++) {
        const baseOpacity = Math.random() * 0.4 + 0.3 // 0.3 to 0.7 opacity
        newStars.push({
          id: i,
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          size: Math.random() * 1.5 + 0.5, // 0.5 to 2px
          baseOpacity,
          currentOpacity: baseOpacity,
          isFlickering: false,
        })
      }
      setStars(newStars)
    }

    generateStars()
  }, [dimensions])

  const startFlickering = useCallback(() => {
    if (stars.length === 0) return

    // Select 1-3 random stars to flicker
    const numberOfStarsToFlicker = Math.floor(Math.random() * 3) + 1
    const selectedStarIds = new Set<number>()

    while (selectedStarIds.size < numberOfStarsToFlicker && selectedStarIds.size < stars.length) {
      selectedStarIds.add(Math.floor(Math.random() * stars.length))
    }

    // Start flickering animation
    setStars((prevStars) =>
      prevStars.map((star, index) => {
        if (selectedStarIds.has(index)) {
          return {
            ...star,
            isFlickering: true,
            currentOpacity: Math.min(star.baseOpacity + 0.5, 1), // Brighten
          }
        }
        return star
      }),
    )

    // Stop flickering after 800ms
    setTimeout(() => {
      setStars((prevStars) =>
        prevStars.map((star, index) => {
          if (selectedStarIds.has(index)) {
            return {
              ...star,
              isFlickering: false,
              currentOpacity: star.baseOpacity, // Return to base opacity
            }
          }
          return star
        }),
      )
    }, 800)

    // Schedule next flicker
    const nextFlickerDelay = Math.random() * 2000 + 3000 // 3-5 seconds
    flickerIntervalRef.current = setTimeout(startFlickering, nextFlickerDelay)
  }, [stars.length])

  useEffect(() => {
    if (stars.length > 0) {
      // Start the first flicker cycle
      const initialDelay = Math.random() * 2000 + 1000 // 1-3 seconds initial delay
      flickerIntervalRef.current = setTimeout(startFlickering, initialDelay)
    }

    return () => {
      if (flickerIntervalRef.current) {
        clearTimeout(flickerIntervalRef.current)
      }
    }
  }, [startFlickering])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          {/* Glow filter for flickering stars */}
          <filter id="starGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Static stars with occasional flickering */}
        {stars.map((star) => (
          <circle
            key={star.id}
            cx={star.x}
            cy={star.y}
            r={star.size}
            fill="#FAE3C6"
            opacity={star.currentOpacity}
            filter={star.isFlickering ? "url(#starGlow)" : undefined}
            style={{
              transition: "opacity 0.4s ease-in-out, transform 0.4s ease-in-out",
              transform: star.isFlickering ? "scale(1.3)" : "scale(1)",
              transformOrigin: `${star.x}px ${star.y}px`,
            }}
          />
        ))}
      </svg>
    </div>
  )
}
