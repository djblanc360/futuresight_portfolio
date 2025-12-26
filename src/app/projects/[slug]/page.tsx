import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProjectBySlug, getSkills } from "@/server/queries"
import { ArrowLeft } from "lucide-react"
import { MagicHeader } from "@/components/magic-header"
import { StarryBackground } from "@/components/starry-background"
import { ProjectEditableContent } from "@/components/project-editable-content"

type ProjectPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const project = await getProjectBySlug(slug)

    if (!project) {
      return {
        title: "Project Not Found | Magical Portfolio",
        description: "Project not found",
      }
    }

    return {
      title: `${project.title} | Magical Portfolio`,
      description: project.description,
    }
  } catch (error) {
    return {
      title: "Project | Magical Portfolio",
      description: "Project case study",
    }
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  try {
    const { slug } = await params
    const [project, allSkills] = await Promise.all([
      getProjectBySlug(slug),
      getSkills(),
    ])

    if (!project) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-[#030304] text-[#FAE3C6] font-serif">
        <MagicHeader />

        <div className="relative pt-20">
          <div className="absolute inset-0 z-0">
            <StarryBackground />
          </div>

          <div className="container mx-auto px-4 py-12 relative z-10">
            <Link
              href="/projects"
              className="inline-flex items-center text-[#C17E3D] hover:text-[#B97452] mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>

            <ProjectEditableContent project={project} allSkills={allSkills} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching project:", error)
    notFound()
  }
}
