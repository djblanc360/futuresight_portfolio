"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProjectCard } from "@/components/project-card"
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { getProjectsWithSkills, skillsData } from "@/server/mock-data"
import type { Skill } from "@/types/skills"
import type { ProjectWithSkills } from "@/types/projects"

type SkillCardProps = {
  skill: Skill
  isDragging?: boolean
  isInDeck?: boolean
}

function SkillCard({ skill, isDragging, isInDeck }: SkillCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: skill.id,
    data: {
      type: "skill",
      skill,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("relative cursor-grab active:cursor-grabbing flex-shrink-0", isInDeck ? "w-20 h-28" : "w-16 h-24")}
      {...attributes}
      {...listeners}
    >
      <Card className="w-full h-full border-[#B97452]/30 bg-[#030304]/80 shadow-lg hover:shadow-[#B97452]/30 transition-all duration-300 overflow-hidden">
        <CardContent className="p-2 flex flex-col items-center justify-center h-full text-center">
          <div className="text-xs font-bold text-[#C17E3D] mb-1 line-clamp-2">{skill.name}</div>
          <Badge
            variant="outline"
            className={cn(
              "text-xs px-1 py-0 border-[#B97452]/30",
              skill.category === "Frontend" && "bg-[#B97452]/20 text-[#C17E3D]",
              skill.category === "Backend" && "bg-[#C17E3D]/20 text-[#B97452]",
              skill.category === "Database" && "bg-[#FAE3C6]/20 text-[#C17E3D]",
              skill.category === "Cloud & DevOps" && "bg-[#B97452]/30 text-[#FAE3C6]",
              skill.category === "Testing" && "bg-[#C17E3D]/30 text-[#FAE3C6]",
              skill.category === "Tools" && "bg-[#FAE3C6]/30 text-[#030304]",
            )}
          >
            {skill.category.split(" ")[0]}
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}

type DroppableSlotProps = {
  id: string
  skill: Skill | null
  position: number
}

function DroppableSlot({ id, skill, position }: DroppableSlotProps) {
  const { setNodeRef, isOver } = useSortable({
    id,
    data: {
      type: "slot",
      position,
    },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-24 h-32 border-2 border-dashed rounded-lg flex items-center justify-center transition-all duration-300",
        isOver ? "border-[#C17E3D] bg-[#C17E3D]/10" : "border-[#B97452]/50",
        skill ? "border-solid border-[#C17E3D]" : "",
      )}
    >
      {skill ? (
        <SkillCard skill={skill} isInDeck={false} />
      ) : (
        <div className="text-center text-[#FAE3C6]/50 text-xs">
          <div className="mb-1">Slot {position + 1}</div>
          <div>Drop skill here</div>
        </div>
      )}
    </div>
  )
}

export function ProjectFilter() {
  const [selectedSkills, setSelectedSkills] = useState<(Skill | null)[]>([null, null, null])
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithSkills[]>(getProjectsWithSkills())
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const updateScrollButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
      setScrollPosition(scrollLeft)
    }
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      updateScrollButtons()
      container.addEventListener("scroll", updateScrollButtons)
      window.addEventListener("resize", updateScrollButtons)

      return () => {
        container.removeEventListener("scroll", updateScrollButtons)
        window.removeEventListener("resize", updateScrollButtons)
      }
    }
  }, [updateScrollButtons])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 200 : 300
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 200 : 300
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const resetFilter = useCallback(() => {
    setSelectedSkills([null, null, null])
    setFilteredProjects(getProjectsWithSkills())
  }, [])

  const filterProjects = useCallback((skills: (Skill | null)[]) => {
    const validSkills = skills.filter((skill): skill is Skill => skill !== null)

    if (validSkills.length === 0) {
      setFilteredProjects(getProjectsWithSkills())
      return
    }

    const allProjects = getProjectsWithSkills()
    const filtered = allProjects.filter((project) => {
      return validSkills.every((selectedSkill) =>
        project.skills.some((projectSkill) => projectSkill.id === selectedSkill.id),
      )
    })

    setFilteredProjects(filtered)
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeData = active.data.current
    const overData = over.data.current

    // If dropping a skill onto a slot
    if (activeData?.type === "skill" && overData?.type === "slot") {
      const skill = activeData.skill as Skill
      const position = overData.position as number

      const newSelectedSkills = [...selectedSkills]
      newSelectedSkills[position] = skill
      setSelectedSkills(newSelectedSkills)
      filterProjects(newSelectedSkills)
    }
  }

  const removeSkillFromSlot = (position: number) => {
    const newSelectedSkills = [...selectedSkills]
    newSelectedSkills[position] = null
    setSelectedSkills(newSelectedSkills)
    filterProjects(newSelectedSkills)
  }

  const activeSkill = activeId ? skillsData.find((skill) => skill.id === activeId) : null
  const selectedSkillCount = selectedSkills.filter(Boolean).length

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-12">
        {/* Filter Section */}
        <div className="bg-[#222B39]/50 backdrop-blur-sm rounded-lg p-8 border border-[#B97452]/30">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#C17E3D] mb-2">Mystical Project Filter</h2>
            <p className="text-[#FAE3C6]/70">
              Draw 3 skills from the deck and place them in the tarot spread to filter projects
            </p>
          </div>

          {/* Skill Deck */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#C17E3D]">Skill Deck</h3>
            </div>

            <div className="relative">
              {/* Left scroll button */}
              <Button
                onClick={scrollLeft}
                variant="outline"
                size="icon"
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8",
                  "border-[#B97452]/50 text-[#C17E3D] hover:bg-[#B97452]/20 bg-[#030304]/80 backdrop-blur-sm",
                  !canScrollLeft && "opacity-50 cursor-not-allowed",
                )}
                disabled={!canScrollLeft}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Right scroll button */}
              <Button
                onClick={scrollRight}
                variant="outline"
                size="icon"
                className={cn(
                  "absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8",
                  "border-[#B97452]/50 text-[#C17E3D] hover:bg-[#B97452]/20 bg-[#030304]/80 backdrop-blur-sm",
                  !canScrollRight && "opacity-50 cursor-not-allowed",
                )}
                disabled={!canScrollRight}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Scrollable container */}
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide px-8 py-4"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <SortableContext items={skillsData.map((s) => s.id)} strategy={rectSortingStrategy}>
                  {skillsData.map((skill) => (
                    <SkillCard key={skill.id} skill={skill} isInDeck={true} />
                  ))}
                </SortableContext>
              </div>
            </div>
          </div>

          {/* Tarot Spread */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#C17E3D]">Tarot Spread ({selectedSkillCount}/3)</h3>
              <Button
                onClick={resetFilter}
                variant="outline"
                size="sm"
                className="border-[#B97452]/50 text-[#C17E3D] hover:bg-[#B97452]/20 bg-[#222B39]"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            <SortableContext items={["slot-0", "slot-1", "slot-2"]} strategy={rectSortingStrategy}>
              <div className="flex gap-6 justify-center">
                {selectedSkills.map((skill, index) => (
                  <div key={`slot-${index}`} className="relative">
                    <DroppableSlot id={`slot-${index}`} skill={skill} position={index} />
                    {skill && (
                      <button
                        onClick={() => removeSkillFromSlot(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </SortableContext>
          </div>

          {/* Filter Status */}
          <div className="text-center">
            <p className="text-[#FAE3C6]/70">
              {selectedSkillCount === 0 && "Select skills to filter projects"}
              {selectedSkillCount > 0 &&
                selectedSkillCount < 3 &&
                `${3 - selectedSkillCount} more skill${3 - selectedSkillCount > 1 ? "s" : ""} needed`}
              {selectedSkillCount === 3 &&
                `Showing ${filteredProjects.length} project${filteredProjects.length !== 1 ? "s" : ""} matching all selected skills`}
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#FAE3C6]/70 mb-4">No projects found matching the selected skills.</p>
              <p className="text-[#FAE3C6]/50">Try selecting different skills or reset the filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeId && activeSkill ? <SkillCard skill={activeSkill} isDragging={true} isInDeck={true} /> : null}
      </DragOverlay>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </DndContext>
  )
}
