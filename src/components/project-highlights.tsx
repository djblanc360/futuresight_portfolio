"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TarotCard } from "@/components/tarot-card"
import { ChevronLeft, ChevronRight, Wand2, Sparkles, Send, Code } from "lucide-react"
import { cn } from "@/lib/utils"

const projectsData = [
  {
    title: "Enchanted E-Commerce",
    description: "A full-stack e-commerce platform with magical user experiences and seamless payment integration.",
    icon: <Wand2 className="h-6 w-6" />,
    tags: ["Next.js", "Stripe", "Tailwind CSS"],
  },
  {
    title: "Spellbound Dashboard",
    description: "An admin dashboard with real-time analytics and interactive data visualization.",
    icon: <Sparkles className="h-6 w-6" />,
    tags: ["React", "D3.js", "Firebase"],
  },
  {
    title: "Mystic Messenger",
    description: "A real-time chat application with end-to-end encryption and magical animations.",
    icon: <Send className="h-6 w-6" />,
    tags: ["Socket.io", "Express", "MongoDB"],
  },
  {
    title: "Arcane API",
    description: "A RESTful API service with comprehensive documentation and robust authentication.",
    icon: <Code className="h-6 w-6" />,
    tags: ["Node.js", "Express", "JWT"],
  },
  {
    title: "Divination Blog",
    description: "A content management system with markdown support and SEO optimization.",
    icon: <Sparkles className="h-6 w-6" />,
    tags: ["Gatsby", "GraphQL", "Netlify CMS"],
  },
  {
    title: "Crystal Compiler",
    description: "A custom language compiler that translates magical incantations into executable code.",
    icon: <Wand2 className="h-6 w-6" />,
    tags: ["TypeScript", "ANTLR", "WebAssembly"],
  },
]

export function ProjectHighlights() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    checkIsDesktop()
    window.addEventListener("resize", checkIsDesktop)

    return () => window.removeEventListener("resize", checkIsDesktop)
  }, [])

  const nextSlide = () => {
    if (isDesktop) {
      // Desktop: show 4 cards at a time
      const maxIndex = Math.max(0, projectsData.length - 4)
      setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
    } else {
      // Mobile: show 1 card at a time
      setCurrentIndex((prev) => (prev + 1) % projectsData.length)
    }
  }

  const prevSlide = () => {
    if (isDesktop) {
      // Desktop: show 4 cards at a time
      setCurrentIndex((prev) => Math.max(prev - 1, 0))
    } else {
      // Mobile: show 1 card at a time
      setCurrentIndex((prev) => (prev - 1 + projectsData.length) % projectsData.length)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Calculate visible cards based on screen size
  const getVisibleCards = () => {
    if (isDesktop) {
      return projectsData.slice(currentIndex, currentIndex + 4)
    } else {
      return [projectsData[currentIndex]]
    }
  }

  // Calculate total slides for pagination
  const getTotalSlides = () => {
    if (isDesktop) {
      return Math.max(1, projectsData.length - 2)
    } else {
      return projectsData.length
    }
  }

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#C17E3D] mb-4">Magical Creations</h2>
          <p className="text-[#FAE3C6]/70 max-w-2xl mx-auto">
            Explore my enchanted collection of projects, each crafted with precision and care.
          </p>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden lg:block">
          <div className="relative mb-20">
            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10",
                "border-[#B97452]/50 text-[#C17E3D] hover:bg-[#B97452]/20 bg-[#030304]/80 backdrop-blur-sm",
                currentIndex === 0 && "opacity-50 cursor-not-allowed",
              )}
              onClick={prevSlide}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10",
                "border-[#B97452]/50 text-[#C17E3D] hover:bg-[#B97452]/20 bg-[#030304]/80 backdrop-blur-sm",
                currentIndex >= projectsData.length - 4 && "opacity-50 cursor-not-allowed",
              )}
              onClick={nextSlide}
              disabled={currentIndex >= projectsData.length - 4}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Cards Container */}
            <div className="grid grid-cols-4 gap-2 transition-all duration-500 ease-in-out">
              {getVisibleCards().map((project, index) => (
                <div key={`${currentIndex}-${index}`} className="transform transition-all duration-500">
                  <TarotCard
                    title={project.title}
                    description={project.description}
                    icon={project.icon}
                    tags={project.tags}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Slider Layout */}
        <div className="lg:hidden">
          <div className="relative mb-20">
            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 border-[#B97452]/50 text-[#C17E3D] hover:bg-[#B97452]/20 bg-[#030304]/80 backdrop-blur-sm"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 border-[#B97452]/50 text-[#C17E3D] hover:bg-[#B97452]/20 bg-[#030304]/80 backdrop-blur-sm"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Single Card Container */}
            <div className="px-8">
              <div className="transform transition-all duration-500 ease-in-out">
                <TarotCard
                  title={getVisibleCards()[0].title}
                  description={getVisibleCards()[0].description}
                  icon={getVisibleCards()[0].icon}
                  tags={getVisibleCards()[0].tags}
                />
              </div>
            </div>
          </div>

          {/* Mobile Pagination Dots */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: getTotalSlides() }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentIndex ? "bg-[#C17E3D] w-6" : "bg-[#B97452]/50 hover:bg-[#B97452]/70",
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Pagination Dots */}
        <div className="hidden lg:flex justify-center gap-2">
          {Array.from({ length: getTotalSlides() }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex ? "bg-[#C17E3D] w-6" : "bg-[#B97452]/50 hover:bg-[#B97452]/70",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
