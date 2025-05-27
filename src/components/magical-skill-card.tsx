"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Sparkles, Code, Database, Cloud, Palette, TestTube, Package } from "lucide-react"

interface SkillCategory {
  name: string
  icon: React.ReactNode
  skills: Array<{ name: string; level: number }>
  color: string
}

const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    icon: <Palette className="w-5 h-5" />,
    color: "from-[#B97452] to-[#C17E3D]",
    skills: [
      { name: "React", level: 90 },
      { name: "TypeScript", level: 85 },
      { name: "Next.js", level: 85 },
      { name: "Tailwind CSS", level: 90 },
    ],
  },
  {
    name: "Backend",
    icon: <Code className="w-5 h-5" />,
    color: "from-[#C17E3D] to-[#B97452]",
    skills: [
      { name: "Node.js", level: 85 },
      { name: "Express", level: 80 },
      { name: "GraphQL", level: 75 },
      { name: "REST APIs", level: 90 },
    ],
  },
  {
    name: "Database",
    icon: <Database className="w-5 h-5" />,
    color: "from-[#B97452] to-[#FAE3C6]",
    skills: [
      { name: "MongoDB", level: 80 },
      { name: "PostgreSQL", level: 75 },
      { name: "Redis", level: 70 },
      { name: "Prisma", level: 80 },
    ],
  },
  {
    name: "Cloud & DevOps",
    icon: <Cloud className="w-5 h-5" />,
    color: "from-[#FAE3C6] to-[#C17E3D]",
    skills: [
      { name: "AWS", level: 70 },
      { name: "Docker", level: 75 },
      { name: "CI/CD", level: 80 },
      { name: "Vercel", level: 85 },
    ],
  },
  {
    name: "Testing",
    icon: <TestTube className="w-5 h-5" />,
    color: "from-[#C17E3D] to-[#B97452]",
    skills: [
      { name: "Jest", level: 75 },
      { name: "Cypress", level: 70 },
      { name: "React Testing", level: 80 },
      { name: "E2E Testing", level: 75 },
    ],
  },
  {
    name: "Tools",
    icon: <Package className="w-5 h-5" />,
    color: "from-[#B97452] to-[#C17E3D]",
    skills: [
      { name: "Git", level: 90 },
      { name: "Webpack", level: 70 },
      { name: "Vite", level: 80 },
      { name: "Redux", level: 80 },
    ],
  },
]

export function MagicalSkillCards() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skillCategories.map((category, index) => (
        <Card
          key={category.name}
          className={cn(
            "relative overflow-hidden border-[#B97452]/30 bg-[#030304]/60 backdrop-blur-sm cursor-pointer transition-all duration-500",
            "hover:border-[#C17E3D]/50 hover:shadow-xl hover:shadow-[#B97452]/20",
            selectedCategory === index ? "scale-105 border-[#C17E3D]" : "",
          )}
          onClick={() => setSelectedCategory(selectedCategory === index ? null : index)}
        >
          {/* Magical glow effect */}
          <div
            className={cn(
              "absolute inset-0 opacity-0 transition-opacity duration-500",
              selectedCategory === index ? "opacity-100" : "group-hover:opacity-50",
            )}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10`} />
          </div>

          {/* Card content */}
          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-full bg-gradient-to-br ${category.color}`}>{category.icon}</div>
              <h3 className="text-xl font-bold text-[#C17E3D]">{category.name}</h3>
              <Sparkles
                className={cn(
                  "w-4 h-4 text-[#C17E3D] ml-auto transition-transform duration-300",
                  selectedCategory === index ? "rotate-180" : "",
                )}
              />
            </div>

            {/* Skills */}
            <div className="space-y-3">
              {category.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="relative"
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-[#FAE3C6]/80">{skill.name}</span>
                    <span
                      className={cn(
                        "text-xs text-[#C17E3D] transition-all duration-300",
                        hoveredSkill === skill.name ? "scale-110 font-bold" : "",
                      )}
                    >
                      {skill.level}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="relative h-2 bg-[#222B39] rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out",
                        `bg-gradient-to-r ${category.color}`,
                      )}
                      style={{
                        width: selectedCategory === index || hoveredSkill === skill.name ? `${skill.level}%` : "0%",
                      }}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                  </div>

                  {/* Hover tooltip */}
                  {hoveredSkill === skill.name && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#030304]/90 px-2 py-1 rounded text-xs text-[#FAE3C6] whitespace-nowrap z-10">
                      {skill.level >= 85
                        ? "Expert"
                        : skill.level >= 70
                          ? "Advanced"
                          : skill.level >= 50
                            ? "Intermediate"
                            : "Learning"}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Category stats */}
            <div
              className={cn(
                "mt-4 pt-4 border-t border-[#B97452]/20 flex justify-between text-xs text-[#FAE3C6]/60 transition-all duration-300",
                selectedCategory === index ? "opacity-100" : "opacity-0",
              )}
            >
              <span>
                Avg: {Math.round(category.skills.reduce((acc, skill) => acc + skill.level, 0) / category.skills.length)}
                %
              </span>
              <span>{category.skills.length} skills</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
