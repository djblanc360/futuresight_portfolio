"use client"

import { useEffect, useState } from "react"

interface Star {
  id: number
  x: number
  y: number
  color: string
  opacity: number
  size: number
  animationDuration: number
  delay: number
}

interface ShootingStar {
  id: number
  startX: number
  startY: number
  endX: number
  endY: number
  animationDuration: number
}

export function StarryBackgroundAnimated() {
  const [stars, setStars] = useState<Star[]>([])
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Star colors
  const starColor = "#FAE3C6"
  const shootingStarColor = "#C17E3D"

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

    // Generate falling stars
    const generateStars = () => {
      const newStars: Star[] = []
      const starCount = Math.floor((dimensions.width * dimensions.height) / 8000) // Responsive star density

      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * dimensions.width,
          y: Math.random() * (dimensions.height + streakLength * 2) - streakLength, // Distribute across viewport and beyond
          color: "#FAE3C6",
          opacity: Math.random() * 0.6 + 0.4, // 0.4 to 1.0 opacity
          size: Math.random() * 3 + 1,
          animationDuration: Math.random() * 20 + 15, // 15-35 seconds
          delay: Math.random() * 40 - 20, // -20 to 20 seconds (negative delays start mid-animation)
        })
      }
      setStars(newStars)
    }

    generateStars()
  }, [dimensions])

  useEffect(() => {
    // Generate shooting stars at random intervals
    const generateShootingStar = () => {
      const newShootingStar: ShootingStar = {
        id: Date.now(),
        startX: Math.random() * dimensions.width,
        startY: Math.random() * (dimensions.height * 0.3), // Upper portion of screen
        endX: Math.random() * dimensions.width,
        endY: Math.random() * dimensions.height + dimensions.height * 0.5,
        animationDuration: Math.random() * 2 + 1, // 1-3 seconds
      }

      setShootingStars((prev) => [...prev, newShootingStar])

      // Remove shooting star after animation
      setTimeout(() => {
        setShootingStars((prev) => prev.filter((star) => star.id !== newShootingStar.id))
      }, newShootingStar.animationDuration * 1000)
    }

    const interval = setInterval(
      () => {
        generateShootingStar()
      },
      Math.random() * 2000 + 3000,
    ) // 3-5 seconds

    return () => clearInterval(interval)
  }, [dimensions])

  const isMobile = dimensions.width < 768
  const streakLength = isMobile ? 200 : 250

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ backgroundColor: "#030304" }}>
      <svg width="100%" height="100%" className="absolute inset-0" style={{ minHeight: "100vh" }}>
        <defs>
          {/* Gradient for star streaks */}
          <linearGradient id="starGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={starColor} stopOpacity="0.8" />
            <stop offset="50%" stopColor={starColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={starColor} stopOpacity="0" />
          </linearGradient>

          {/* Gradient for shooting stars */}
          <linearGradient id="shootingStarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={shootingStarColor} stopOpacity="0" />
            <stop offset="50%" stopColor={shootingStarColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={shootingStarColor} stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Falling Stars */}
        {stars.map((star) => (
          <g key={star.id}>
            {/* Star streak */}
            <rect
              x={star.x - 0.5}
              y={star.y - streakLength}
              width="1"
              height={streakLength}
              fill="url(#starGradient)"
              opacity={star.opacity}
              style={{
                animation: `fall ${star.animationDuration}s linear infinite, twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: `${star.delay}s, ${Math.random() * 2}s`,
              }}
            />
            {/* Star point */}
            <circle
              cx={star.x}
              cy={star.y}
              r={star.size}
              fill={star.color}
              opacity={star.opacity}
              style={{
                animation: `fall ${star.animationDuration}s linear infinite, twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: `${star.delay}s, ${Math.random() * 2}s`,
              }}
            />
          </g>
        ))}

        {/* Shooting Stars */}
        {shootingStars.map((shootingStar) => (
          <line
            key={shootingStar.id}
            x1={shootingStar.startX}
            y1={shootingStar.startY}
            x2={shootingStar.endX}
            y2={shootingStar.endY}
            stroke="url(#shootingStarGradient)"
            strokeWidth="2"
            style={{
              animation: `shoot ${shootingStar.animationDuration}s ease-out forwards`,
              opacity: 0,
            }}
          />
        ))}
      </svg>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-${streakLength}px);
          }
          100% {
            transform: translateY(${dimensions.height + streakLength}px);
          }
        }

        @keyframes shoot {
          0% {
            opacity: 0;
            stroke-dasharray: 0, 1000;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            stroke-dasharray: 1000, 0;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  )
}
