"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TarotCardProps {
  title: string
  description: string
  icon: React.ReactNode
  tags: string[]
}

export function TarotCard({ title, description, icon, tags }: TarotCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
  }

  return (
    <div className="w-[240px] mx-auto">
      <div
        ref={cardRef}
        className="relative h-[360px] perspective-1000 group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="absolute inset-0 transition-all duration-500 preserve-3d cursor-pointer"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y + (isFlipped ? 180 : 0)}deg)`,
          }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front of card */}
          <Card className="absolute inset-0 backface-hidden border-[#B97452]/30 bg-[#030304]/80 shadow-xl shadow-[#B97452]/20 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/magical-bg.png')] opacity-5 bg-repeat"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B97452]/0 via-[#B97452] to-[#B97452]/0"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#B97452]/0 via-[#B97452] to-[#B97452]/0"></div>

            <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center">
              <div className="mb-4 p-3 bg-[#B97452]/70 rounded-full">{icon}</div>
              <h3 className="text-lg font-bold mb-2 text-[#C17E3D]">{title}</h3>
              <p className="text-sm text-[#FAE3C6]/70">{description}</p>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[#C17E3D] text-sm">Click to reveal details</span>
              </div>
            </CardContent>
          </Card>

          {/* Back of card */}
          <Card className="absolute inset-0 backface-hidden rotate-y-180 border-[#B97452]/30 bg-[#222B39] shadow-xl shadow-[#B97452]/20 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/magical-bg.png')] opacity-5 bg-repeat"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B97452]/0 via-[#B97452] to-[#B97452]/0"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#B97452]/0 via-[#B97452] to-[#B97452]/0"></div>

            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <h3 className="text-lg font-bold mb-6 text-[#C17E3D]">{title}</h3>

              <div className="space-y-4 w-full">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#B97452]/70"></div>
                  <p className="text-[#FAE3C6]">Frontend: React, TypeScript</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#B97452]/70"></div>
                  <p className="text-[#FAE3C6]">Backend: Node.js, Express</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#B97452]/70"></div>
                  <p className="text-[#FAE3C6]">Database: MongoDB</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#B97452]/70"></div>
                  <p className="text-[#FAE3C6]">Deployment: AWS, Docker</p>
                </div>
              </div>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[#C17E3D] text-sm">Click to flip back</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tags below the card - positioned outside the card container */}
        <div className="absolute top-full left-0 right-0 mt-4 flex flex-wrap justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {tags.map((tag, index) => (
            <Badge key={index} className="bg-[#B97452]/70 text-[#C17E3D] hover:bg-[#B97452]/80">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

