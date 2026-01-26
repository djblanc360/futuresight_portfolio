import { cache } from "react"
import { db } from "./db"
import { projects, skills, projectsToSkills } from "./db/schema"
import { eq, desc } from "drizzle-orm"
import type { ProjectWithSkills } from "@/types/projects"
import type { Skill } from "@/types/skills"

// Helper to parse skill categories from JSON string
function parseSkillCategories(skill: typeof skills.$inferSelect) {
  return {
    ...skill,
    categories: JSON.parse(skill.categories) as string[],
  }
}

// Cached data fetching functions for use in React Server Components
export const getProjects = cache(async (): Promise<ProjectWithSkills[]> => {
  try {
    const result = await db
      .select({
        project: projects,
        skill: skills,
      })
      .from(projects)
      .leftJoin(projectsToSkills, eq(projects.id, projectsToSkills.projectId))
      .leftJoin(skills, eq(projectsToSkills.skillId, skills.id))
      .orderBy(desc(projects.date))

    // Group projects and their skills
    const projectsMap = new Map<number, ProjectWithSkills>()

    result.forEach((row) => {
      if (!projectsMap.has(row.project.id)) {
        projectsMap.set(row.project.id, {
          ...row.project,
          skills: [],
        })
      }

      if (row.skill) {
        const project = projectsMap.get(row.project.id)!
        const skill = parseSkillCategories(row.skill)
        if (!project.skills.some((s) => s.id === skill.id)) {
          project.skills.push(skill)
        }
      }
    })

    return Array.from(projectsMap.values())
  } catch (error) {
    console.error("Error in getProjects:", error)
    throw error
  }
})

export const getFeaturedProjects = cache(async (): Promise<ProjectWithSkills[]> => {
  try {
    const result = await db
      .select({
        project: projects,
        skill: skills,
      })
      .from(projects)
      .leftJoin(projectsToSkills, eq(projects.id, projectsToSkills.projectId))
      .leftJoin(skills, eq(projectsToSkills.skillId, skills.id))
      .where(eq(projects.featured, 1))
      .orderBy(desc(projects.date))

    // Group projects and their skills
    const projectsMap = new Map<number, ProjectWithSkills>()

    result.forEach((row) => {
      if (!projectsMap.has(row.project.id)) {
        projectsMap.set(row.project.id, {
          ...row.project,
          skills: [],
        })
      }

      if (row.skill) {
        const project = projectsMap.get(row.project.id)!
        const skill = parseSkillCategories(row.skill)
        if (!project.skills.some((s) => s.id === skill.id)) {
          project.skills.push(skill)
        }
      }
    })

    return Array.from(projectsMap.values())
  } catch (error) {
    console.error("Error in getFeaturedProjects:", error)
    throw error
  }
})

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectWithSkills | null> => {
  try {
    const result = await db
      .select({
        project: projects,
        skill: skills,
      })
      .from(projects)
      .leftJoin(projectsToSkills, eq(projects.id, projectsToSkills.projectId))
      .leftJoin(skills, eq(projectsToSkills.skillId, skills.id))
      .where(eq(projects.slug, slug))

    if (result.length === 0) {
      return null
    }

    // Group skills for the project
    const project = result[0]!.project
    const projectSkills = result
      .filter((row) => row.skill !== null)
      .map((row) => parseSkillCategories(row.skill!))
      // Remove duplicates
      .filter((skill, index, self) => self.findIndex((s) => s.id === skill.id) === index)

    return {
      ...project,
      skills: projectSkills,
    }
  } catch (error) {
    console.error(`Error in getProjectBySlug for slug ${slug}:`, error)
    throw error
  }
})

export const getSkills = cache(async (): Promise<Skill[]> => {
  try {
    const result = await db.select().from(skills).orderBy(skills.name)

    return result.map(parseSkillCategories)
  } catch (error) {
    console.error("Error in getSkills:", error)
    throw error
  }
})

export const getSkillsByCategory = cache(async (): Promise<Record<string, Skill[]>> => {
  try {
    const result = await db.select().from(skills).orderBy(skills.name)

    const categories: Record<string, Skill[]> = {}

    result.forEach((skill) => {
      const parsedSkill = parseSkillCategories(skill)
      parsedSkill.categories.forEach((category) => {
        if (!categories[category]) {
          categories[category] = []
        }
        categories[category]!.push(parsedSkill)
      })
    })

    return categories
  } catch (error) {
    console.error("Error in getSkillsByCategory:", error)
    throw error
  }
})
