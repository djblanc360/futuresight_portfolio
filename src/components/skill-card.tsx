"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SkillCardProps {
  name: string
  level: number
}

export function SkillCard({ name, level }: SkillCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const currentElement = document.getElementById(`skill-${name}`)
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [name])

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        if (currentLevel < level) {
          setCurrentLevel((prev) => Math.min(prev + 1, level))
        }
      }, 20)

      return () => clearTimeout(timer)
    }
  }, [isVisible, currentLevel, level])

  return (
    <Card
      id={`skill-${name}`}
      className="border-[#B97452]/30 bg-[#030304]/80 shadow-lg hover:shadow-[#B97452]/30 transition-shadow duration-300 overflow-hidden group"
    >
      <CardContent className="p-4">
        <div className="text-center mb-3">
          <h3 className="font-bold text-[#C17E3D] group-hover:scale-110 transition-transform duration-300">{name}</h3>
        </div>

        <div className="relative h-2 bg-[#B97452]/70 rounded-full overflow-hidden">
          <div
            className={cn(
              "absolute top-0 left-0 h-full bg-gradient-to-r from-[#B97452] to-[#C17E3D] transition-all duration-1000 ease-out",
              isVisible ? "" : "w-0",
            )}
            style={{ width: `${currentLevel}%` }}
          ></div>
        </div>

        <div className="mt-2 text-right">
          <span className="text-xs text-[#FAE3C6]/70">{currentLevel}%</span>
        </div>
      </CardContent>
    </Card>
  )
}
