"use server"

import { eq } from "drizzle-orm"
import { db } from "./db"
import { projects, skills, projectsToSkills } from "./db/schema"
import { revalidatePath } from "next/cache"

export async function createProject(projectData: {
  title: string
  slug: string
  company: string
  description: string
  caseStudy: string
  date: string
  githubUrl?: string
  demoUrl?: string
  imageUrl?: string
  featured: number
}) {
  const [newProject] = await db
    .insert(projects)
    .values({
      title: projectData.title,
      slug: projectData.slug,
      company: projectData.company,
      description: projectData.description,
      caseStudy: projectData.caseStudy,
      date: new Date(projectData.date),
      githubUrl: projectData.githubUrl || null,
      demoUrl: projectData.demoUrl || null,
      imageUrl: projectData.imageUrl || null,
      featured: projectData.featured,
    })
    .returning()

  revalidatePath("/")
  revalidatePath("/dashboard")
  revalidatePath("/projects")

  return newProject
}

export async function deleteProject(id: number) {
  // First delete any skill relationships
  await db.delete(projectsToSkills).where(eq(projectsToSkills.projectId, id))

  // Then delete the project
  await db.delete(projects).where(eq(projects.id, id))

  revalidatePath("/")
  revalidatePath("/dashboard")
  revalidatePath("/projects")

  return { success: true }
}

// Skill Actions
export async function createSkill(skillData: {
  name: string
  categories: string[]
  level: number
  icon?: string
  color?: string
}) {
  const [newSkill] = await db
    .insert(skills)
    .values({
      name: skillData.name,
      categories: JSON.stringify(skillData.categories),
      level: skillData.level,
      icon: skillData.icon || null,
      color: skillData.color || null,
    })
    .returning()

  // Parse categories back to array for return
  const result = {
    ...newSkill,
    categories: JSON.parse(newSkill?.categories || "[]") as string[],
  }

  revalidatePath("/")
  revalidatePath("/dashboard")

  return result
}

export async function deleteSkill(id: number) {
  // First delete any project relationships
  await db.delete(projectsToSkills).where(eq(projectsToSkills.skillId, id))

  // Then delete the skill
  await db.delete(skills).where(eq(skills.id, id))

  revalidatePath("/")
  revalidatePath("/dashboard")

  return { success: true }
}

export async function renameCategory(oldName: string, newName: string) {
  // Get all skills that have this category
  const allSkills = await db.select().from(skills)

  // Update each skill that contains the old category name
  const updatePromises = allSkills
    .filter((skill) => {
      const categories = JSON.parse(skill.categories) as string[]
      return categories.includes(oldName)
    })
    .map((skill) => {
      const categories = JSON.parse(skill.categories) as string[]
      const updatedCategories = categories.map((cat) =>
        cat === oldName ? newName : cat
      )
      return db
        .update(skills)
        .set({ categories: JSON.stringify(updatedCategories) })
        .where(eq(skills.id, skill.id))
    })

  await Promise.all(updatePromises)

  revalidatePath("/")
  revalidatePath("/dashboard")

  return { success: true, updatedCount: updatePromises.length }
}

