import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { ProjectWithSkills } from "@/types/projects"

type ProjectCardProps = {
  project: ProjectWithSkills
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <Card className="h-full bg-[#222B39]/80 border-[#B97452]/30 hover:border-[#C17E3D]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#B97452]/20 overflow-hidden group">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={project.imageUrl || "/placeholder.svg?height=200&width=400&query=project"}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030304] to-transparent opacity-60" />
        </div>

        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-xl font-bold text-[#C17E3D] group-hover:text-[#FAE3C6] transition-colors duration-300">
              {project.title}
            </h2>
            {project.featured === 1 && (
              <span className="bg-[#B97452]/30 text-[#C17E3D] text-xs px-2 py-1 rounded-full">Featured</span>
            )}
          </div>

          <p className="text-[#FAE3C6]/70 mb-4 line-clamp-2">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.skills.slice(0, 3).map((skill) => (
              <Badge key={skill.id} variant="outline" className="bg-[#B97452]/20 text-[#C17E3D] border-[#B97452]/30">
                {skill.name}
              </Badge>
            ))}
            {project.skills.length > 3 && (
              <Badge variant="outline" className="bg-[#B97452]/10 text-[#C17E3D]/70 border-[#B97452]/20">
                +{project.skills.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex justify-between items-center text-xs text-[#FAE3C6]/50">
            <span>{project.company}</span>
            <span>
              {new Date(project.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
