import { db } from "./index"
import { projects, skills, projectsToSkills } from "./schema"
import { skillsData, projectsData, projectsToSkillsData } from "../mock-data"

export async function seed() {
  console.log("🌱 Seeding database...")

  try {
    // Clear existing data
    console.log("Clearing existing data...")
    await db.delete(projectsToSkills)
    await db.delete(projects)
    await db.delete(skills)

    // Insert skills
    console.log("Inserting skills...")
    for (const skill of skillsData) {
      await db.insert(skills).values({
        id: skill.id,
        name: skill.name,
        categories: JSON.stringify(skill.categories), // Store as JSON string
        level: skill.level,
        icon: skill.icon,
        color: skill.color,
        createdAt: skill.createdAt,
      })
    }

    // Insert projects
    console.log("Inserting projects...")
    for (const project of projectsData) {
      await db.insert(projects).values({
        title: project.title,
        slug: project.slug,
        company: project.company,
        date: project.date ?? new Date(),
        description: project.description,
        githubUrl: project.githubUrl,
        demoUrl: project.demoUrl,
        imageUrl: project.imageUrl,
        caseStudy: project.caseStudy,
        featured: project.featured,
        createdAt: project.createdAt,
      })
    }

    // Insert project-skill relationships
    console.log("Inserting project-skill relationships...")
    for (const relation of projectsToSkillsData) {
      await db.insert(projectsToSkills).values({
        projectId: relation.projectId,
        skillId: relation.skillId,
      })
    }

    console.log("✅ Seeding complete!")
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}
