import type React from "react"

// Base Skill type (matches Drizzle schema)
export type Skill = {
  id: number
  name: string
  category: string
  level: number
  icon: string | null
  color: string | null
  createdAt: Date | null
}

// Skill with related projects
export type SkillWithProjects = Skill & {
  projects: Array<{
    id: number
    title: string
    slug: string
    company: string
    date: Date
    description: string
    githubUrl: string | null
    demoUrl: string | null
    imageUrl: string | null
    caseStudy: string
    featured: number | null
    createdAt: Date | null
  }>
}

// API request types
export type CreateSkillRequest = {
  name: string
  category: string
  level: number
  icon?: string
  color?: string
}

// UI component types
export type SkillCategory = {
  name: string
  icon: React.ReactNode
  skills: Array<{ name: string; level: number }>
  color: string
}

// Grouped skills by category
export type SkillsByCategory = Record<string, Skill[]>
