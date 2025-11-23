import { NextResponse } from "next/server"
import { db } from "@/server/db"
import { projects, skills, projectsToSkills, type Project, type Skill, type ProjectWithSkills } from "@/server/db/schema"
import { eq, desc } from "drizzle-orm"
import type { CreateProjectRequest } from "@/types/projects"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const featured = searchParams.get("featured")
  const slug = searchParams.get("slug")

  try {
    if (slug) {
      // Get a single project by slug with its skills
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
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }

      // Group skills for the project
      const project = result[0]!.project
      const projectSkills = result
        .filter((row) => row.skill !== null)
        .map((row) => {
          const skill = row.skill!
          return {
            ...skill,
            categories: JSON.parse(skill.categories) as string[],
          }
        })

      return NextResponse.json({
        ...project,
        skills: projectSkills,
      })
    }

    if (featured === "true") {
      // Get featured projects with their skills
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
          const skill = {
            ...row.skill,
            categories: JSON.parse(row.skill.categories) as string[],
          }
          if (!project.skills.some((s) => s.id === skill.id)) {
            project.skills.push(skill)
          }
        }
      })

      return NextResponse.json(Array.from(projectsMap.values()))
    }

    // Get all projects with their skills
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
        const skill = {
          ...row.skill,
          categories: JSON.parse(row.skill.categories) as string[],
        }
        if (!project.skills.some((s) => s.id === skill.id)) {
          project.skills.push(skill)
        }
      }
    })

    return NextResponse.json(Array.from(projectsMap.values()))
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects", details: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as CreateProjectRequest

    // Validate required fields
    const requiredFields: (keyof CreateProjectRequest)[] = ["title", "slug", "company", "date", "description", "caseStudy"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Create new project with generated ID
    const newProject = {
      id: Date.now(), // Simple ID generation for demo
      title: body.title,
      slug: body.slug,
      company: body.company,
      date: new Date(body.date),
      description: body.description,
      githubUrl: body.githubUrl ?? null,
      demoUrl: body.demoUrl ?? null,
      imageUrl: body.imageUrl ?? null,
      caseStudy: body.caseStudy,
      featured: body.featured ?? 0,
      createdAt: new Date(),
    }

    // In a real app, you would insert into the database here
    // For now, we'll just return the created project
    return NextResponse.json({
      ...newProject,
      skills: [], // New projects start with no skills
    })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
