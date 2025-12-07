import { NextResponse } from "next/server"
import { db } from "@/server/db"
import { skills, projects, projectsToSkills } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import type { CreateSkillRequest, SkillWithProjects, SkillsByCategory } from "@/types/skills"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const byCategory = searchParams.get("byCategory")

  try {
    if (byCategory === "true") {
      // Get all skills grouped by category
      const allSkills = await db.select().from(skills).orderBy(skills.name)

      // Parse categories from JSON and group skills by category
      const skillsByCategory: SkillsByCategory = {}

      allSkills.forEach((skill) => {
        const categories = JSON.parse(skill.categories) as string[]
        categories.forEach((category) => {
          skillsByCategory[category] ??= []
          // Parse the skill to include categories as array
          const skillWithCategories = {
            ...skill,
            categories,
          }
          // Avoid duplicates
          if (!skillsByCategory[category]!.some((s) => s.id === skill.id)) {
            skillsByCategory[category]!.push(skillWithCategories)
          }
        })
      })

      return NextResponse.json(skillsByCategory)
    }

    // Get all skills with their projects
    const result = await db
      .select({
        skill: skills,
        project: projects,
      })
      .from(skills)
      .leftJoin(projectsToSkills, eq(skills.id, projectsToSkills.skillId))
      .leftJoin(projects, eq(projectsToSkills.projectId, projects.id))
      .orderBy(skills.name)

    // Group skills and their projects
    const skillsMap = new Map<number, SkillWithProjects>()

    result.forEach((row) => {
      if (!skillsMap.has(row.skill.id)) {
        // Parse categories from JSON
        const categories = JSON.parse(row.skill.categories) as string[]
        skillsMap.set(row.skill.id, {
          ...row.skill,
          categories,
          projects: [],
        })
      }

      if (row.project) {
        const skill = skillsMap.get(row.skill.id)!
        if (!skill.projects.some((p) => p.id === row.project!.id)) {
          skill.projects.push(row.project)
        }
      }
    })

    return NextResponse.json(Array.from(skillsMap.values()))
  } catch (error) {
    console.error("Error fetching skills:", error)
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as CreateSkillRequest

    // Validate required fields
    const requiredFields: (keyof CreateSkillRequest)[] = ["name", "categories", "level"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }
    
    // Validate categories is an array
    if (!Array.isArray(body.categories) || body.categories.length === 0) {
      return NextResponse.json({ error: "categories must be a non-empty array" }, { status: 400 })
    }

    // Insert into database
    const [newSkill] = await db
      .insert(skills)
      .values({
        name: body.name,
        categories: JSON.stringify(body.categories), // Store as JSON string
        level: body.level,
        icon: body.icon ?? null,
        color: body.color ?? null,
      })
      .returning()

    if (!newSkill) {
      return NextResponse.json({ error: "Failed to create skill" }, { status: 500 })
    }

    // Parse categories from JSON for response
    const skillResponse = {
      ...newSkill,
      categories: JSON.parse(newSkill.categories) as string[],
    }

    return NextResponse.json(skillResponse)
  } catch (error) {
    console.error("Error creating skill:", error)
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 })
  }
}
