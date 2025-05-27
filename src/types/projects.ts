export interface CreateProjectRequest {
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

export interface ProjectResponse {
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
  featured: number
  createdAt: Date
  skills: Array<{
    id: number
    name: string
    category: string
    level: number
    icon: string | null
    color: string | null
  }>
} 