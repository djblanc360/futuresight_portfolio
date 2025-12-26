"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Experience {
  id: string
  company: string
  role: string
  year: string
  description: string
  x: number
  y: number
}

const experiences: Experience[] = [
  {
    id: "1",
    company: "Good 02 Studios",
    role: "Full Stack Developer",
    year: "2025 - Present",
    description:
      "Responsible for creating, improving and maintaining entire technical stack. Evaluates new technology and services for determining implementation. Ensures systems are secure, scalable and GDPR compliant.",
    x: 70,
    y: 20,
  },
  {
    id: "2",
    company: "Starshot Ventures",
    role: "Shopify Consultant",
    year: "2024 - 2025",
    description:
      "Served as the sole developer and an advisory role for five brands, implementing features and third-party integrations, as well as conducting product research and UX audits.",
    x: 30,
    y: 35,
  },
  {
    id: "3",
    company: "Archipelago Companies",
    role: "Frontend Developer",
    year: "2022 - 2024",
    description: "Built and documented reusable integrations and middlewares. Maintained and developed Shopify stores the company's several brands.",
    x: 65,
    y: 60,
  },
  {
    id: "4",
    company: "Bryt Designs",
    role: "Full Stack Developer",
    year: "2018 - 2022",
    description:
      "Developed and maintained private backend applications to augment Shopify's frontend capabilities.",
    x: 25,
    y: 75,
  },
]

export function ExperienceConstellation() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [stars, setStars] = useState<Array<{ left: string; top: string; delay: string }>>([])

  useEffect(() => {
    // Generate stars only on client side after hydration
    const starPositions = Array.from({ length: 50 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
    }))
    setStars(starPositions)
  }, [])

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: Math.min(600, window.innerHeight * 0.7),
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId)
    setIsZoomed(true)
  }

  const handleClose = () => {
    setIsZoomed(false)
    setTimeout(() => setSelectedNode(null), 500)
  }

  const selectedExperience = experiences.find((exp) => exp.id === selectedNode)

  // Calculate actual positions based on container dimensions
  const getNodePosition = (x: number, y: number) => ({
    x: (x / 100) * dimensions.width,
    y: (y / 100) * dimensions.height,
  })

  // Determine if content should appear on left or right side of node
  const getContentPosition = (x: number) => {
    // If node is in the right half of the screen, show content on the left
    return x > 50 ? "left" : "right"
  }

  return (
    <div ref={containerRef} className="relative w-full h-[600px] overflow-hidden rounded-lg">
      {/* Background stars */}
      <div className="absolute inset-0 bg-[#030304]/50 rounded-lg">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#FAE3C6]/30 rounded-full animate-pulse"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Constellation lines */}
      <svg
        className={cn(
          "absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500",
          isZoomed ? "opacity-30" : "opacity-100",
        )}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B97452" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#C17E3D" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#B97452" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Draw lines between nodes */}
        {experiences.length >= 2 && (
          <line
            x1={getNodePosition(experiences[0]!.x, experiences[0]!.y).x}
            y1={getNodePosition(experiences[0]!.x, experiences[0]!.y).y}
            x2={getNodePosition(experiences[1]!.x, experiences[1]!.y).x}
            y2={getNodePosition(experiences[1]!.x, experiences[1]!.y).y}
            stroke="url(#lineGradient)"
            strokeWidth="2"
            className="animate-pulse"
          />
        )}
        {experiences.length >= 3 && (
          <line
            x1={getNodePosition(experiences[1]!.x, experiences[1]!.y).x}
            y1={getNodePosition(experiences[1]!.x, experiences[1]!.y).y}
            x2={getNodePosition(experiences[2]!.x, experiences[2]!.y).x}
            y2={getNodePosition(experiences[2]!.x, experiences[2]!.y).y}
            stroke="url(#lineGradient)"
            strokeWidth="2"
            className="animate-pulse"
          />
        )}
        {experiences.length >= 4 && (
          <line
            x1={getNodePosition(experiences[2]!.x, experiences[2]!.y).x}
            y1={getNodePosition(experiences[2]!.x, experiences[2]!.y).y}
            x2={getNodePosition(experiences[3]!.x, experiences[3]!.y).x}
            y2={getNodePosition(experiences[3]!.x, experiences[3]!.y).y}
            stroke="url(#lineGradient)"
            strokeWidth="2"
            className="animate-pulse"
          />
        )}
      </svg>

      {/* Zoom overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-[#030304]/70 transition-opacity duration-500",
          isZoomed ? "opacity-80" : "opacity-0 pointer-events-none",
        )}
        onClick={handleClose}
      />

      {/* Constellation nodes */}
      <div
        className={cn(
          "absolute inset-0 transition-transform duration-700 ease-in-out",
          isZoomed && selectedExperience ? "scale-[2.5]" : "scale-100",
        )}
        style={{
          transformOrigin: selectedExperience
            ? `${getNodePosition(selectedExperience.x, selectedExperience.y).x}px ${getNodePosition(selectedExperience.x, selectedExperience.y).y}px`
            : "center center",
        }}
      >
        {experiences.map((exp) => {
          const position = getNodePosition(exp.x, exp.y)
          const isSelected = selectedNode === exp.id

          return (
            <div
              key={exp.id}
              className={cn(
                "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500",
                isZoomed && !isSelected ? "opacity-30" : "opacity-100",
              )}
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
              }}
            >
              {/* Node glow effect */}
              <div className="absolute inset-0 w-32 h-32 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                <div
                  className={cn(
                    "absolute inset-0 bg-[#C17E3D]/20 rounded-full blur-xl animate-pulse transition-all duration-300",
                    isSelected ? "opacity-100 scale-125" : "opacity-70",
                  )}
                ></div>
                <div
                  className={cn(
                    "absolute inset-4 bg-[#B97452]/30 rounded-full blur-lg animate-pulse transition-all duration-300",
                    isSelected ? "opacity-100 scale-125" : "opacity-70",
                  )}
                ></div>
              </div>

              {/* Node button */}
              <button
                onClick={() => handleNodeClick(exp.id)}
                className={cn(
                  "relative group cursor-pointer transition-all duration-300",
                  "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#C17E3D] rounded-full",
                  isSelected ? "scale-110" : "",
                )}
                disabled={isZoomed && !isSelected}
              >
                <div
                  className={cn(
                    "relative w-20 h-20 rounded-full p-[2px] shadow-lg transition-all duration-300",
                    isSelected
                      ? "bg-gradient-to-br from-[#C17E3D] to-[#B97452] shadow-[#C17E3D]/50"
                      : "bg-gradient-to-br from-[#B97452] to-[#C17E3D] shadow-[#B97452]/50",
                  )}
                >
                  <div className="w-full h-full rounded-full bg-[#222B39] flex items-center justify-center">
                    <Sparkles
                      className={cn(
                        "w-6 h-6 transition-all duration-300",
                        isSelected ? "text-[#FAE3C6]" : "text-[#C17E3D]",
                      )}
                    />
                  </div>
                </div>

                {/* Node label */}
                <div
                  className={cn(
                    "absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap transition-all duration-300",
                    isZoomed && !isSelected ? "opacity-0" : "opacity-100",
                  )}
                >
                  <div className="bg-[#030304]/80 px-3 py-1 rounded-md border border-[#B97452]/30">
                    <p className="text-xs text-[#C17E3D] font-bold">{exp.company}</p>
                    <p className="text-xs text-[#FAE3C6]/70">{exp.year}</p>
                  </div>
                </div>
              </button>
            </div>
          )
        })}
      </div>

      {/* Detailed content panel */}
      {selectedExperience && (
        <div
          className={cn(
            "absolute top-1/2 transform -translate-y-1/2 transition-all duration-500 z-20 max-w-md w-full",
            isZoomed ? "opacity-100" : "opacity-0 pointer-events-none",
            getContentPosition(selectedExperience.x) === "left"
              ? "md:right-[55%] translate-x-0"
              : "md:left-[55%] translate-x-0",
          )}
        >
          <Card
            className={cn(
              "bg-[#222B39]/95 backdrop-blur-sm border-[#B97452]/50 shadow-2xl shadow-[#B97452]/30 transition-all duration-500",
              isZoomed ? "scale-100" : "scale-90",
            )}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#030304]/50 hover:bg-[#030304]/70 transition-colors"
            >
              <X className="w-4 h-4 text-[#FAE3C6]" />
            </button>

            <CardContent className="p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[#C17E3D] mb-1">{selectedExperience.role}</h3>
                <p className="text-[#FAE3C6]/70 mb-4">{selectedExperience.year}</p>
                <p className="text-[#FAE3C6]/80 leading-relaxed">{selectedExperience.description}</p>
              </div>

              <div className="pt-4 border-t border-[#B97452]/30">
                <h4 className="text-sm font-semibold text-[#C17E3D] mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#B97452]/20 rounded-full text-xs text-[#C17E3D]">React</span>
                  <span className="px-3 py-1 bg-[#B97452]/20 rounded-full text-xs text-[#C17E3D]">Node.js</span>
                  <span className="px-3 py-1 bg-[#B97452]/20 rounded-full text-xs text-[#C17E3D]">TypeScript</span>
                  <span className="px-3 py-1 bg-[#B97452]/20 rounded-full text-xs text-[#C17E3D]">AWS</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
