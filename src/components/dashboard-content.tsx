"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { skillsData, projectsData } from "@/server/mock-data"
import type { Skill } from "@/types/skills"
import type { Project } from "@/types/projects"

export function DashboardContent() {
  const [skills, setSkills] = useState<Skill[]>(skillsData)
  const [projects, setProjects] = useState<Project[]>(projectsData)
  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const [newSkillName, setNewSkillName] = useState("")
  const [newSkillCategory, setNewSkillCategory] = useState("")
  const [error, setError] = useState("")

  const [isAddingProject, setIsAddingProject] = useState(false)
  const [newProject, setNewProject] = useState({
    title: "",
    slug: "",
    company: "",
    date: "",
    description: "",
    githubUrl: "",
    demoUrl: "",
    imageUrl: "",
    caseStudy: "",
    featured: 0,
  })
  const [projectError, setProjectError] = useState("")

  const skillCategories = ["Frontend", "Backend", "Database", "Cloud & DevOps", "Testing", "Tools"]

  const handleAddSkill = () => {
    setError("")

    if (!newSkillName.trim()) {
      setError("Skill name is required")
      return
    }

    if (!newSkillCategory.trim()) {
      setError("Skill category is required")
      return
    }

    // Check for duplicate skill names (case insensitive)
    const isDuplicate = skills.some((skill) => skill.name.toLowerCase() === newSkillName.trim().toLowerCase())

    if (isDuplicate) {
      setError("A skill with this name already exists")
      return
    }

    const newSkill: Skill = {
      id: Math.max(...skills.map((s) => s.id)) + 1,
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: 50, // Default level
      icon: "code", // Default icon
      color: "from-[#B97452] to-[#C17E3D]", // Default color
      createdAt: new Date(),
    }

    setSkills([...skills, newSkill])
    setNewSkillName("")
    setNewSkillCategory("")
    setIsAddingSkill(false)
  }

  const handleCancelAddSkill = () => {
    setIsAddingSkill(false)
    setNewSkillName("")
    setNewSkillCategory("")
    setError("")
  }

  const handleRemoveSkill = (skillId: number) => {
    setSkills(skills.filter((skill) => skill.id !== skillId))
  }

  const handleAddProject = async () => {
    setProjectError("")

    // Validation
    if (!newProject.title.trim()) {
      setProjectError("Project title is required")
      return
    }

    if (!newProject.slug.trim()) {
      setProjectError("Project slug is required")
      return
    }

    if (!newProject.company.trim()) {
      setProjectError("Company is required")
      return
    }

    if (!newProject.date) {
      setProjectError("Date is required")
      return
    }

    if (!newProject.description.trim()) {
      setProjectError("Description is required")
      return
    }

    if (!newProject.caseStudy.trim()) {
      setProjectError("Case study is required")
      return
    }

    // Check for duplicate slug (case insensitive)
    const isDuplicateSlug = projects.some(
      (project) => project.slug.toLowerCase() === newProject.slug.trim().toLowerCase(),
    )

    if (isDuplicateSlug) {
      setProjectError("A project with this slug already exists")
      return
    }

    try {
      const projectToCreate = {
        ...newProject,
        title: newProject.title.trim(),
        slug: newProject.slug.trim(),
        company: newProject.company.trim(),
        description: newProject.description.trim(),
        caseStudy: newProject.caseStudy.trim(),
        date: new Date(newProject.date),
        id: Math.max(...projects.map((p) => p.id)) + 1,
        createdAt: new Date(),
      }

      setProjects([...projects, projectToCreate])

      // Reset form
      setNewProject({
        title: "",
        slug: "",
        company: "",
        date: "",
        description: "",
        githubUrl: "",
        demoUrl: "",
        imageUrl: "",
        caseStudy: "",
        featured: 0,
      })
      setIsAddingProject(false)
    } catch (error) {
      setProjectError("Failed to create project")
    }
  }

  const handleCancelAddProject = () => {
    setIsAddingProject(false)
    setNewProject({
      title: "",
      slug: "",
      company: "",
      date: "",
      description: "",
      githubUrl: "",
      demoUrl: "",
      imageUrl: "",
      caseStudy: "",
      featured: 0,
    })
    setProjectError("")
  }

  const generateSlugFromTitle = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleRemoveProject = (projectId: number) => {
    setProjects(projects.filter((project) => project.id !== projectId))
  }

  return (
    <div className="space-y-12">
      {/* Skills Section */}
      <Card className="bg-[#222B39]/80 border-[#B97452]/30">
        <CardHeader>
          <CardTitle className="text-2xl text-[#C17E3D]">Skills Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Skills Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#B97452]/30">
                    <th className="text-left py-3 px-4 text-[#C17E3D] font-semibold">Name</th>
                    <th className="text-left py-3 px-4 text-[#C17E3D] font-semibold">Category</th>
                    <th className="text-left py-3 px-4 text-[#C17E3D] font-semibold">Level</th>
                    <th className="text-right py-3 px-4 text-[#C17E3D] font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {skills.map((skill) => (
                    <tr
                      key={skill.id}
                      className="border-b border-[#B97452]/20 hover:bg-[#B97452]/10 transition-colors group"
                    >
                      <td className="py-3 px-4 text-[#FAE3C6]">{skill.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="bg-[#B97452]/20 text-[#C17E3D] border-[#B97452]/30">
                          {skill.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-[#FAE3C6]">{skill.level}%</td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSkill(skill.id)}
                          className={cn(
                            "text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-200",
                            "md:opacity-0 md:group-hover:opacity-100", // Hide on desktop until hover
                            "opacity-100", // Always visible on mobile
                          )}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {/* Add New Skill Row */}
                  {isAddingSkill ? (
                    <tr className="border-b border-[#B97452]/20 bg-[#B97452]/5">
                      <td className="py-3 px-4">
                        <Input
                          value={newSkillName}
                          onChange={(e) => setNewSkillName(e.target.value)}
                          placeholder="Skill name"
                          className="bg-[#030304]/50 border-[#B97452]/30 text-[#FAE3C6]"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={newSkillCategory}
                          onChange={(e) => setNewSkillCategory(e.target.value)}
                          className="w-full bg-[#030304]/50 border border-[#B97452]/30 rounded-md px-3 py-2 text-[#FAE3C6] text-sm"
                        >
                          <option value="">Select category</option>
                          {skillCategories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-[#FAE3C6]/50">50%</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleAddSkill}
                            className="text-green-400 hover:text-green-300 hover:bg-green-500/20"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancelAddSkill}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-3 px-4">
                        <Button
                          variant="ghost"
                          onClick={() => setIsAddingSkill(true)}
                          className="w-full text-[#C17E3D] hover:bg-[#B97452]/20 border-2 border-dashed border-[#B97452]/30 hover:border-[#C17E3D]/50"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Skill
                        </Button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-md p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Call To Action for New Project */}
      <Card className="bg-gradient-to-r from-[#B97452]/20 to-[#C17E3D]/20 border-[#C17E3D]/50">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-[#C17E3D] mb-4">Ready to Showcase Your Next Creation?</h3>
          <p className="text-[#FAE3C6]/80 mb-6 max-w-2xl mx-auto">
            Add a new project to your magical portfolio and share your latest enchanted work with the world.
          </p>
          <Button
            onMouseUp={() => setIsAddingProject(true)}
            className="bg-[#B97452] hover:bg-[#C17E3D] text-[#FAE3C6] px-8 py-3 text-lg font-semibold shadow-lg shadow-[#B97452]/30"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Project
          </Button>
        </CardContent>
      </Card>

      {/* Project Form Overlay */}
      {isAddingProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#222B39] border border-[#B97452]/30 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#C17E3D]">Create New Project</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelAddProject}
                  className="text-[#FAE3C6] hover:bg-[#B97452]/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#C17E3D] mb-2">Title *</label>
                    <Input
                      value={newProject.title}
                      onChange={(e) => {
                        const title = e.target.value
                        setNewProject({
                          ...newProject,
                          title,
                          slug: generateSlugFromTitle(title),
                        })
                      }}
                      placeholder="Project title"
                      className="bg-[#030304]/50 border-[#B97452]/30 text-[#FAE3C6]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#C17E3D] mb-2">Slug *</label>
                    <Input
                      value={newProject.slug}
                      onChange={(e) => setNewProject({ ...newProject, slug: e.target.value })}
                      placeholder="project-slug"
                      className="bg-[#030304]/50 border-[#B97452]/30 text-[#FAE3C6]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#C17E3D] mb-2">Company *</label>
                    <Input
                      value={newProject.company}
                      onChange={(e) => setNewProject({ ...newProject, company: e.target.value })}
                      placeholder="Company name"
                      className="bg-[#030304]/50 border-[#B97452]/30 text-[#FAE3C6]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#C17E3D] mb-2">Date *</label>
                    <Input
                      type="date"
                      value={newProject.date}
                      onChange={(e) => setNewProject({ ...newProject, date: e.target.value })}
                      className="bg-[#030304]/50 border-[#B97452]/30 text-[#FAE3C6]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#C17E3D] mb-2">GitHub URL</label>
                    <Input
                      value={newProject.githubUrl}
                      onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="bg-[#030304]/50 border-[#B97452]/30 text-[#FAE3C6]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#C17E3D] mb-2">Demo URL</label>
                    <Input
                      value={newProject.demoUrl}
                      onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                      placeholder="https://demo.example.com"
                      className="bg-[#030304]/50 border-[#B97452]/30 text-[#FAE3C6]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#C17E3D] mb-2">Image URL</label>
                    <Input
                      value={newProject.imageUrl}
                      onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="bg-[#030304]/50 border-[#B97452]/30 text-[#FAE3C6]"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newProject.featured === 1}
                        onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked ? 1 : 0 })}
                        className="rounded border-[#B97452]/30 bg-[#030304]/50 text-[#C17E3D]"
                      />
                      <span className="text-sm text-[#C17E3D]">Featured Project</span>
                    </label>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#C17E3D] mb-2">Description *</label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="Brief project description"
                      rows={3}
                      className="w-full bg-[#030304]/50 border border-[#B97452]/30 rounded-md px-3 py-2 text-[#FAE3C6] placeholder:text-[#FAE3C6]/50 resize-none"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-[#C17E3D] mb-2">
                      Case Study * (Markdown supported)
                    </label>
                    <textarea
                      value={newProject.caseStudy}
                      onChange={(e) => setNewProject({ ...newProject, caseStudy: e.target.value })}
                      placeholder={`# Project Name

## Overview
Brief overview of the project...

## Challenge
What problem did this project solve?

## Solution
How did you approach the solution?

## Technologies Used
- Technology 1
- Technology 2

## Results
What were the outcomes?`}
                      rows={15}
                      className="w-full bg-[#030304]/50 border border-[#B97452]/30 rounded-md px-3 py-2 text-[#FAE3C6] placeholder:text-[#FAE3C6]/50 font-mono text-sm resize-none"
                    />
                    <p className="text-xs text-[#FAE3C6]/60 mt-1">
                      Use Markdown syntax for formatting. This will be displayed as the project case study.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {projectError && (
                <div className="mt-4 bg-red-500/20 border border-red-500/50 rounded-md p-3">
                  <p className="text-red-400 text-sm">{projectError}</p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-4 justify-end mt-6 pt-6 border-t border-[#B97452]/30">
                <Button
                  variant="outline"
                  onClick={handleCancelAddProject}
                  className="border-[#B97452]/50 text-[#FAE3C6] hover:bg-[#B97452]/20"
                >
                  Cancel
                </Button>
                <Button onClick={handleAddProject} className="bg-[#B97452] hover:bg-[#C17E3D] text-[#FAE3C6]">
                  Create Project
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Section */}
      <Card className="bg-[#222B39]/80 border-[#B97452]/30">
        <CardHeader>
          <CardTitle className="text-2xl text-[#C17E3D]">Projects Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#B97452]/30">
                  <th className="text-left py-3 px-4 text-[#C17E3D] font-semibold">Title</th>
                  <th className="text-left py-3 px-4 text-[#C17E3D] font-semibold">Company</th>
                  <th className="text-left py-3 px-4 text-[#C17E3D] font-semibold">Date</th>
                  <th className="text-left py-3 px-4 text-[#C17E3D] font-semibold">Featured</th>
                  <th className="text-right py-3 px-4 text-[#C17E3D] font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-[#B97452]/20 hover:bg-[#B97452]/10 transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-[#FAE3C6] font-medium">{project.title}</div>
                        <div className="text-[#FAE3C6]/60 text-sm line-clamp-1">{project.description}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#FAE3C6]">{project.company}</td>
                    <td className="py-3 px-4 text-[#FAE3C6]">
                      {new Date(project.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      {project.featured === 1 ? (
                        <Badge className="bg-[#C17E3D]/20 text-[#C17E3D] border-[#C17E3D]/30">Featured</Badge>
                      ) : (
                        <span className="text-[#FAE3C6]/50">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveProject(project.id)}
                        className={cn(
                          "text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-200",
                          "md:opacity-0 md:group-hover:opacity-100", // Hide on desktop until hover
                          "opacity-100", // Always visible on mobile
                        )}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
