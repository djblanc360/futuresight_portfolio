"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Sparkles, Code, Database, Cloud, Palette, TestTube, Package } from "lucide-react"
import type { SkillCategory, Skill } from "@/types/skills"

// Icon mapping for categories
const categoryIcons: Record<string, React.ReactNode> = {
  "Frontend": <Palette className="w-5 h-5" />,
  "Backend": <Code className="w-5 h-5" />,
  "Database": <Database className="w-5 h-5" />,
  "Cloud & DevOps": <Cloud className="w-5 h-5" />,
  "Cloud & Devops": <Cloud className="w-5 h-5" />,
  "Testing": <TestTube className="w-5 h-5" />,
  "Tools": <Package className="w-5 h-5" />,
  "Design": <Palette className="w-5 h-5" />,
  "Ecommerce": <Package className="w-5 h-5" />,
}

// Category color configuration
const skillCategoryConfig: Record<string, { color: string }> = {
  "Frontend": {
    color: "from-[#B97452] to-[#C17E3D]"
  },
  "Backend": {
    color: "from-[#C17E3D] to-[#B97452]"
  },
  "Cloud & Devops": {
    color: "from-[#FAE3C6] to-[#C17E3D]"
  },
  "Design": {
    color: "from-[#B97452] to-[#FAE3C6]"
  },
  "Ecommerce": {
    color: "from-[#C17E3D] to-[#B97452]"
  }
}

// Helper function to convert data to SkillCategory with icons
function createSkillCategories(skills: Skill[]): SkillCategory[] {
  const categories: Record<string, Skill[]> = {}
  
  skills.forEach((skill) => {
    skill.categories.forEach((category) => {
      if (!categories[category]) {
        categories[category] = []
      }
      if (!categories[category]!.some((s) => s.id === skill.id)) {
        categories[category]!.push(skill)
      }
    })
  })
  
  return Object.entries(categories).map(([categoryName, categorySkills]) => {
    const config = skillCategoryConfig[categoryName] || { color: "from-[#B97452] to-[#C17E3D]" }
    return {
      name: categoryName,
      icon: categoryIcons[categoryName] || <Code className="w-5 h-5" />,
      color: config.color,
      skills: categorySkills.map(skill => ({
        name: skill.name,
        level: skill.level,
        categories: skill.categories
      }))
    }
  })
}

export function MagicalSkillCards() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch("/api/skills")
        if (res.ok) {
          const skillsData = await res.json()
          setSkills(skillsData)
        }
      } catch (error) {
        console.error("Error fetching skills:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSkills()
  }, [])
  
  // Get skill categories from database
  const skillCategories = createSkillCategories(skills)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[#FAE3C6]/70">Loading...</p>
      </div>
    )
  }

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
