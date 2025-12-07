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

    // Insert skills and create a mapping from old ID to new ID
    console.log("Inserting skills...")
    const skillIdMap = new Map<number, number>()
    
    for (const skill of skillsData) {
      const [inserted] = await db
        .insert(skills)
        .values({
          name: skill.name,
          categories: JSON.stringify(skill.categories), // Store as JSON string
          level: skill.level,
          icon: skill.icon ?? null,
          color: skill.color ?? null,
          createdAt: skill.createdAt ?? new Date(),
        })
        .returning()
      
      if (inserted) {
        skillIdMap.set(skill.id, inserted.id)
      }
    }

    // Insert projects and create a mapping from old ID to new ID
    console.log("Inserting projects...")
    const projectIdMap = new Map<number, number>()
    
    for (const project of projectsData) {
      const [inserted] = await db
        .insert(projects)
        .values({
          title: project.title,
          slug: project.slug,
          company: project.company,
          date: project.date ?? new Date(),
          description: project.description,
          githubUrl: project.githubUrl ?? null,
          demoUrl: project.demoUrl ?? null,
          imageUrl: project.imageUrl ?? null,
          caseStudy: project.caseStudy ?? "",
          featured: project.featured ?? 0,
          createdAt: project.createdAt ?? new Date(),
        })
        .returning()
      
      if (inserted) {
        projectIdMap.set(project.id, inserted.id)
      }
    }

    // Insert project-skill relationships using the mapped IDs
    console.log("Inserting project-skill relationships...")
    for (const relation of projectsToSkillsData) {
      const newProjectId = projectIdMap.get(relation.projectId)
      const newSkillId = skillIdMap.get(relation.skillId)
      
      if (newProjectId && newSkillId) {
        await db.insert(projectsToSkills).values({
          projectId: newProjectId,
          skillId: newSkillId,
        })
      } else {
        console.warn(
          `Skipping relationship: projectId ${relation.projectId} -> skillId ${relation.skillId} (mapping not found)`
        )
      }
    }

    console.log("✅ Seeding complete!")
    console.log(`   - Inserted ${skillIdMap.size} skills`)
    console.log(`   - Inserted ${projectIdMap.size} projects`)
    console.log(`   - Inserted ${projectsToSkillsData.length} relationships`)
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}
