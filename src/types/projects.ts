// Base Project type (matches Drizzle schema)
export type Project = {
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
}

// Project with related skills
export type ProjectWithSkills = Project & {
  skills: Array<{
    id: number
    name: string
    category: string
    level: number
    icon: string | null
    color: string | null
    createdAt: Date | null
  }>
}

// API request/response types
export type CreateProjectRequest = {
  title: string
  slug: string
  company: string
  date: string
  description: string
  caseStudy: string
  githubUrl?: string
  demoUrl?: string
  imageUrl?: string
  featured?: number
}

export type ProjectResponse = Project & {
  skills: Array<{
    id: number
    name: string
    category: string
    level: number
    icon: string | null
    color: string | null
  }>
}

// Utility type for project-to-skill relationships
export type ProjectToSkill = {
  projectId: number
  skillId: number
} 