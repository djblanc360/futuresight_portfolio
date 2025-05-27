export interface CreateSkillRequest {
  name: string
  category: string
  level: number
  icon?: string
  color?: string
}

export interface SkillWithProjects {
  id: number
  name: string
  category: string
  level: number
  icon: string | null
  color: string | null
  createdAt: Date | null
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

export type SkillsByCategory = Record<string, Array<{
  id: number
  name: string
  category: string
  level: number
  icon: string | null
  color: string | null
  createdAt: Date | null
}>>
