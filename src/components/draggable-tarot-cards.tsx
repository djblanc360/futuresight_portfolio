"use client"

import { useState } from "react"
import Image from "next/image"
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
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface TarotCard {
  id: string
  title: string
  image: string
}

const initialCards: TarotCard[] = [
  { id: "creator", title: "The Creator", image: "/images/creator-card.jpg" },
  { id: "visionary", title: "The Visionary", image: "/images/visionary-card.jpg" },
  { id: "researcher", title: "The Researcher", image: "/images/researcher-card.jpg" },
]

interface SortableCardProps {
  card: TarotCard
  isDragging?: boolean
}

function SortableCard({ card, isDragging }: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: card.id,
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
      className="relative group cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <div className="relative w-full h-full transform transition-transform duration-300 hover:scale-105">
        <Image
          src={card.image || "/placeholder.svg"}
          alt={card.title}
          width={350}
          height={500}
          className="rounded-lg shadow-xl shadow-[#B97452]/50 border-2 border-[#B97452]/50 pointer-events-none select-none"
          draggable={false}
        />

        {/* Card label - optional overlay */}
        <div className="absolute bottom-4 left-4 right-4 bg-[#222B39]/90 backdrop-blur-sm rounded-md px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <p className="text-[#C17E3D] font-bold text-center">{card.title}</p>
        </div>
      </div>
    </div>
  )
}

export function DraggableTarotCards() {
  const [cards, setCards] = useState(initialCards)
  const [activeId, setActiveId] = useState<string | null>(null)

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }

    setActiveId(null)
  }

  const activeCard = cards.find((card) => card.id === activeId)

  return (
    <div className="relative h-[600px] w-full max-w-2xl mx-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={cards.map((c) => c.id)} strategy={rectSortingStrategy}>
          <div className="relative h-full w-full">
            {/* Instructions */}
            <div className="absolute -bottom-6 left-0 right-0 text-center">
              <p className="text-[#FAE3C6]/60 text-sm">Shuffle around aspects</p>
            </div>

            {/* Cards container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {cards.map((card, index) => {
                  const rotation = index === 0 ? -5 : index === 1 ? 5 : -3
                  const offsetX = index === 0 ? 0 : index === 1 ? 40 : 80
                  const offsetY = index === 0 ? 0 : index === 1 ? 20 : 40

                  return (
                    <div
                      key={card.id}
                      className="absolute"
                      style={{
                        left: `${offsetX}px`,
                        top: `${offsetY}px`,
                        transform: `rotate(${rotation}deg)`,
                        zIndex: cards.length - index,
                      }}
                    >
                      <SortableCard card={card} isDragging={activeId === card.id} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </SortableContext>

        <DragOverlay>
          {activeId && activeCard ? (
            <div className="cursor-grabbing">
              <Image
                src={activeCard.image || "/placeholder.svg"}
                alt={activeCard.title}
                width={350}
                height={500}
                className="rounded-lg shadow-2xl shadow-[#B97452]/70 border-2 border-[#C17E3D] select-none"
                draggable={false}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
