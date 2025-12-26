import { cache } from "react"
import type { ProjectWithSkills, SkillWithProjects } from "./db/schema"

// Cached data fetching functions for use in React Server Components
export const getProjects = cache(async (): Promise<ProjectWithSkills[]> => {
  try {
    // Use relative URL for API routes in the same app
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/projects`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error("API error:", errorData)
      throw new Error(`Failed to fetch projects: ${res.status} ${res.statusText}`)
    }

    return res.json()
  } catch (error) {
    console.error("Error in getProjects:", error)
    throw error
  }
})

export const getFeaturedProjects = cache(async (): Promise<ProjectWithSkills[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/projects?featured=true`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      },
    )

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error("API error:", errorData)
      throw new Error(`Failed to fetch featured projects: ${res.status} ${res.statusText}`)
    }

    return res.json()
  } catch (error) {
    console.error("Error in getFeaturedProjects:", error)
    throw error
  }
})

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectWithSkills> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/projects?slug=${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error("API error:", errorData)
      throw new Error(`Failed to fetch project with slug ${slug}: ${res.status} ${res.statusText}`)
    }

    return res.json()
  } catch (error) {
    console.error(`Error in getProjectBySlug for slug ${slug}:`, error)
    throw error
  }
})

export const getSkills = cache(async (): Promise<SkillWithProjects[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/skills`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error("API error:", errorData)
      throw new Error(`Failed to fetch skills: ${res.status} ${res.statusText}`)
    }

    return res.json()
  } catch (error) {
    console.error("Error in getSkills:", error)
    throw error
  }
})

export const getSkillsByCategory = cache(async (): Promise<Record<string, SkillWithProjects[]>> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/skills?byCategory=true`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      },
    )

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error("API error:", errorData)
      throw new Error(`Failed to fetch skills by category: ${res.status} ${res.statusText}`)
    }

    return res.json()
  } catch (error) {
    console.error("Error in getSkillsByCategory:", error)
    throw error
  }
})
