import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
// Database retrieval - commented out for later use
// import { getProjectBySlug } from "@/src/server/queries"

// Import mock data function instead
import { getProjectBySlug } from "@/server/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Github, ExternalLink } from "lucide-react"
import { MagicHeader } from "@/components/magic-header"
import { StarryBackground } from "@/components/starry-background"
import { MDXContent } from "@/components/mdx-content"

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  try {
    // Database retrieval - commented out for later use
    // const project = await getProjectBySlug(params.slug)

    // Use mock data instead
    const project = getProjectBySlug(params.slug)

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
  // Database retrieval - commented out for later use
  // try {
  //   const project = await getProjectBySlug(params.slug)
  // } catch (error) {
  //   notFound()
  // }

  // Use mock data instead
  const project = getProjectBySlug(params.slug)

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
          <Link href="/projects" className="inline-flex items-center text-[#C17E3D] hover:text-[#B97452] mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-5xl font-bold text-[#C17E3D] mb-4">{project.title}</h1>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.skills.map((skill) => (
                  <Badge key={skill.id} className="bg-[#B97452]/20 text-[#C17E3D] hover:bg-[#B97452]/30">
                    {skill.name}
                  </Badge>
                ))}
              </div>

              <div className="prose prose-invert prose-amber max-w-none">
                <MDXContent content={project.caseStudy} />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#222B39]/80 rounded-lg p-6 sticky top-24">
                {project.imageUrl && (
                  <div className="mb-6 rounded-lg overflow-hidden">
                    <Image
                      src={project.imageUrl || "/placeholder.svg"}
                      alt={project.title}
                      width={500}
                      height={300}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-[#FAE3C6]/60">Company</h3>
                    <p className="text-[#FAE3C6]">{project.company}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-[#FAE3C6]/60">Date</h3>
                    <p className="text-[#FAE3C6]">
                      {new Date(project.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col gap-3">
                    {project.githubUrl && (
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-[#B97452] text-[#C17E3D] hover:bg-[#B97452]/20"
                      >
                        <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          View Repository
                        </Link>
                      </Button>
                    )}

                    {project.demoUrl && (
                      <Button asChild className="w-full bg-[#B97452] hover:bg-[#C17E3D] text-[#FAE3C6]">
                        <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Live Demo
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
