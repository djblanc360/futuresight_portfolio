import type { Metadata } from "next"
import { MagicHeader } from "@/components/magic-header"
import { StarryBackground } from "@/components/starry-background"
import { ProjectFilter } from "@/components/project-filter"

export const metadata: Metadata = {
  title: "Projects | Magical Portfolio",
  description: "Explore my magical collection of projects and case studies",
}

export default async function ProjectsPage() {
  // Database retrieval - commented out for later use
  // let projects = []
  // let error = null

  // try {
  //   projects = await getProjects()
  // } catch (err) {
  //   console.error("Error fetching projects:", err)
  //   error = err instanceof Error ? err.message : "An unknown error occurred"
  // }

  return (
    <div className="min-h-screen bg-[#030304] text-[#FAE3C6] font-serif">
      <MagicHeader />

      <div className="relative pt-20">
        <div className="absolute inset-0 z-0">
          <StarryBackground />
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-[#C17E3D] mb-4">Magical Creations</h1>
            <p className="text-xl text-[#FAE3C6]/80 max-w-2xl mx-auto">
              Explore my enchanted collection of projects, each crafted with precision and care.
            </p>
          </div>

          <ProjectFilter />
        </div>
      </div>
    </div>
  )
}
