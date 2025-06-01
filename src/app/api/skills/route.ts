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
      const allSkills = await db.select().from(skills).orderBy(skills.category, skills.name)

      // Group skills by category
      const skillsByCategory: SkillsByCategory = {}

      allSkills.forEach((skill) => {
        skillsByCategory[skill.category] ??= []
        skillsByCategory[skill.category]!.push(skill)
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
      .orderBy(skills.category, skills.name)

    // Group skills and their projects
    const skillsMap = new Map<number, SkillWithProjects>()

    result.forEach((row) => {
      if (!skillsMap.has(row.skill.id)) {
        skillsMap.set(row.skill.id, {
          ...row.skill,
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
    const requiredFields: (keyof CreateSkillRequest)[] = ["name", "category", "level"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Create new skill with generated ID
    const newSkill = {
      id: Date.now(), // Simple ID generation for demo
      name: body.name,
      category: body.category,
      level: body.level,
      icon: body.icon ?? "code",
      color: body.color ?? "from-[#B97452] to-[#C17E3D]",
      createdAt: new Date(),
    }

    // In a real app, you would insert into the database here
    // For now, we'll just return the created skill
    return NextResponse.json(newSkill)
  } catch (error) {
    console.error("Error creating skill:", error)
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 })
  }
}
