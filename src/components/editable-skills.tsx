"use client"

import { useState } from "react"
import { X, Plus, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { addSkillToProject, removeSkillFromProject } from "@/server/actions"
import type { Skill } from "@/types/skills"

type EditableSkillsProps = {
  projectId: number
  assignedSkills: Skill[]
  allSkills: Skill[]
  onUpdate: (skills: Skill[]) => void
}

export function EditableSkills({
  projectId,
  assignedSkills,
  allSkills,
  onUpdate,
}: EditableSkillsProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState<number | null>(null)

  // Filter out already assigned skills
  const availableSkills = allSkills.filter(
    (skill) => !assignedSkills.some((assigned) => assigned.id === skill.id)
  )

  const handleRemoveSkill = async (skillId: number) => {
    setIsLoading(skillId)
    try {
      const result = await removeSkillFromProject(projectId, skillId)
      if (result.success) {
        onUpdate(assignedSkills.filter((s) => s.id !== skillId))
      }
    } catch (error) {
      console.error("Failed to remove skill:", error)
    } finally {
      setIsLoading(null)
    }
  }

  const handleAddSkill = async (skill: Skill) => {
    setIsLoading(skill.id)
    try {
      const result = await addSkillToProject(projectId, skill.id)
      if (result.success) {
        onUpdate([
          ...assignedSkills,
          {
            id: skill.id,
            name: skill.name,
            categories: skill.categories,
            level: skill.level,
            icon: skill.icon ?? null,
            color: skill.color ?? null,
            createdAt: skill.createdAt ?? null,
          },
        ])
      }
    } catch (error) {
      console.error("Failed to add skill:", error)
    } finally {
      setIsLoading(null)
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Assigned Skills */}
      <div className="flex flex-wrap gap-2">
        {assignedSkills.map((skill) => (
          <Badge
            key={skill.id}
            className="bg-[#B97452]/20 text-[#C17E3D] hover:bg-[#B97452]/30 pr-1 flex items-center gap-1 group"
          >
            <span>{skill.name}</span>
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill.id)}
              disabled={isLoading === skill.id}
              className="ml-1 p-0.5 rounded-full opacity-60 hover:opacity-100 hover:bg-[#B97452]/40 transition-all cursor-pointer disabled:opacity-30"
              title={`Remove ${skill.name}`}
            >
              {isLoading === skill.id ? (
                <span className="block h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
              ) : (
                <X className="h-3 w-3" />
              )}
            </button>
          </Badge>
        ))}

        {/* Add Skill Button */}
        {!isAdding && availableSkills.length > 0 && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border border-dashed border-[#B97452]/40 text-[#C17E3D]/70 hover:border-[#C17E3D] hover:text-[#C17E3D] hover:bg-[#B97452]/10 transition-all cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            Add Skill
          </button>
        )}
      </div>

      {/* Skill Selector Dropdown */}
      {isAdding && (
        <div className="relative">
          <div className="absolute top-0 left-0 z-20 w-64 bg-[#1a1f2e] border border-[#B97452]/30 rounded-lg shadow-xl overflow-hidden">
            <div className="p-2 border-b border-[#B97452]/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#FAE3C6]/60">
                  Select a skill to add
                </span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="p-1 rounded hover:bg-[#B97452]/20 text-[#FAE3C6]/60 hover:text-[#FAE3C6] transition-colors cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {availableSkills.length === 0 ? (
                <div className="p-3 text-center text-sm text-[#FAE3C6]/40">
                  No more skills available
                </div>
              ) : (
                availableSkills.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => handleAddSkill(skill)}
                    disabled={isLoading === skill.id}
                    className="w-full px-3 py-2 text-left text-sm text-[#FAE3C6] hover:bg-[#B97452]/20 transition-colors flex items-center justify-between cursor-pointer disabled:opacity-50"
                  >
                    <span>{skill.name}</span>
                    {isLoading === skill.id ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#C17E3D] border-t-transparent" />
                    ) : (
                      <span className="text-xs text-[#FAE3C6]/40">
                        {skill.categories.join(", ")}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsAdding(false)}
          />
        </div>
      )}
    </div>
  )
}

