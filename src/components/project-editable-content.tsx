"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import { Github, ExternalLink, SquarePen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EditableField } from "@/components/editable-field"
import { ImageDropzone } from "@/components/image-dropzone"
import { MDXContent } from "@/components/mdx-content"
import { EditableSkills } from "@/components/editable-skills"
import { updateProject } from "@/server/actions"
import type { ProjectWithSkills } from "@/types/projects"
import type { Skill } from "@/types/skills"

interface ProjectEditableContentProps {
  project: ProjectWithSkills
  allSkills: Skill[]
}

export function ProjectEditableContent({ project, allSkills }: ProjectEditableContentProps) {
  const router = useRouter()
  const [isEditingImage, setIsEditingImage] = useState(false)
  const [currentProject, setCurrentProject] = useState(project)

  const handleUpdate = async (field: string, value: string | null) => {
    try {
      const updated = await updateProject(currentProject.id, { [field]: value })
      if (updated) {
        setCurrentProject((prev) => ({ ...prev, [field]: value }))
        router.refresh()
      }
    } catch (error) {
      console.error(`Failed to update ${field}:`, error)
      throw error
    }
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return "-"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return ""
    return new Date(date).toISOString().split("T")[0] || ""
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {/* Title */}
        <SignedIn>
          <EditableField
            value={currentProject.title}
            onSave={(value) => handleUpdate("title", value)}
            placeholder="Project title"
            className="mb-4"
            displayClassName="text-3xl md:text-5xl font-bold text-[#C17E3D]"
            inputClassName="text-2xl md:text-4xl font-bold"
          />
        </SignedIn>
        <SignedOut>
          <h1 className="text-3xl md:text-5xl font-bold text-[#C17E3D] mb-4">
            {currentProject.title}
          </h1>
        </SignedOut>

        {/* Skills badges */}
        <SignedIn>
          <div className="mb-6">
            <EditableSkills
              projectId={currentProject.id}
              assignedSkills={currentProject.skills}
              allSkills={allSkills}
              onUpdate={(skills) =>
                setCurrentProject((prev) => ({ ...prev, skills }))
              }
            />
          </div>
        </SignedIn>
        <SignedOut>
          <div className="flex flex-wrap gap-2 mb-6">
            {currentProject.skills.map((skill) => (
              <Badge
                key={skill.id}
                className="bg-[#B97452]/20 text-[#C17E3D] hover:bg-[#B97452]/30"
              >
                {skill.name}
              </Badge>
            ))}
          </div>
        </SignedOut>

        {/* Case Study */}
        <SignedIn>
          <EditableField
            value={currentProject.caseStudy || ""}
            onSave={(value) => handleUpdate("caseStudy", value)}
            fieldType="textarea"
            placeholder="Write your case study in Markdown..."
            className="mb-6"
            displayClassName="prose prose-invert prose-amber max-w-none"
            inputClassName="font-mono text-sm"
            renderDisplay={(value) => <MDXContent content={value} />}
          />
        </SignedIn>
        <SignedOut>
          <div className="prose prose-invert prose-amber max-w-none">
            <MDXContent content={currentProject.caseStudy || ""} />
          </div>
        </SignedOut>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-[#222B39]/80 rounded-lg p-6 sticky top-24">
          {/* Project Image */}
          <SignedIn>
            <div className="mb-6">
              {isEditingImage ? (
                <ImageDropzone
                  currentImage={currentProject.imageUrl}
                  onImageChange={async (imageUrl) => {
                    await handleUpdate("imageUrl", imageUrl)
                    setIsEditingImage(false)
                  }}
                  onCancel={() => setIsEditingImage(false)}
                />
              ) : (
                <div className="group relative rounded-lg overflow-hidden">
                  {currentProject.imageUrl ? (
                    <Image
                      src={currentProject.imageUrl}
                      alt={currentProject.title}
                      width={500}
                      height={300}
                      className="w-full h-auto object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-[#1a1f2e] flex items-center justify-center">
                      <span className="text-[#FAE3C6]/40">No image</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsEditingImage(true)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-2 rounded-md bg-black/60 text-[#C17E3D] hover:bg-black/80 transition-all"
                    title="Edit image"
                  >
                    <SquarePen className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </SignedIn>
          <SignedOut>
            {currentProject.imageUrl && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <Image
                  src={currentProject.imageUrl}
                  alt={currentProject.title}
                  width={500}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </SignedOut>

          <div className="space-y-4">
            {/* Company */}
            <SignedIn>
              <EditableField
                value={currentProject.company}
                onSave={(value) => handleUpdate("company", value)}
                label="Company"
                placeholder="Company name"
                displayClassName="text-[#FAE3C6]"
              />
            </SignedIn>
            <SignedOut>
              <div>
                <h3 className="text-sm font-medium text-[#FAE3C6]/60">Company</h3>
                <p className="text-[#FAE3C6]">{currentProject.company}</p>
              </div>
            </SignedOut>

            {/* Date */}
            <SignedIn>
              <EditableField
                value={formatDateForInput(currentProject.date)}
                onSave={(value) => handleUpdate("date", value)}
                fieldType="date"
                label="Date"
                displayClassName="text-[#FAE3C6]"
                renderDisplay={() => formatDate(currentProject.date)}
              />
            </SignedIn>
            <SignedOut>
              <div>
                <h3 className="text-sm font-medium text-[#FAE3C6]/60">Date</h3>
                <p className="text-[#FAE3C6]">{formatDate(currentProject.date)}</p>
              </div>
            </SignedOut>

            {/* Description (hidden field, editable) */}
            <SignedIn>
              <EditableField
                value={currentProject.description}
                onSave={(value) => handleUpdate("description", value)}
                fieldType="textarea"
                label="Description"
                placeholder="Short project description..."
                displayClassName="text-[#FAE3C6] text-sm"
              />
            </SignedIn>

            {/* GitHub URL */}
            <SignedIn>
              <EditableField
                value={currentProject.githubUrl || ""}
                onSave={(value) => handleUpdate("githubUrl", value || null)}
                fieldType="url"
                label="GitHub URL"
                placeholder="https://github.com/..."
                displayClassName="text-[#FAE3C6] text-sm truncate"
              />
            </SignedIn>

            {/* Demo URL */}
            <SignedIn>
              <EditableField
                value={currentProject.demoUrl || ""}
                onSave={(value) => handleUpdate("demoUrl", value || null)}
                fieldType="url"
                label="Demo URL"
                placeholder="https://..."
                displayClassName="text-[#FAE3C6] text-sm truncate"
              />
            </SignedIn>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col gap-3">
              {currentProject.githubUrl && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-[#B97452] text-[#C17E3D] hover:bg-[#B97452]/20"
                >
                  <Link
                    href={currentProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    View Repository
                  </Link>
                </Button>
              )}

              {currentProject.demoUrl && (
                <Button
                  asChild
                  className="w-full bg-[#B97452] hover:bg-[#C17E3D] text-[#FAE3C6]"
                >
                  <Link
                    href={currentProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
  )
}

