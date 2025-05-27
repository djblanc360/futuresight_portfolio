"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wand2, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function MagicHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-serif",
        isScrolled ? "bg-[#222B39]/90 backdrop-blur-md shadow-lg shadow-amber-900/10 py-3" : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-amber-700/20 rounded-full group-hover:bg-amber-700/30 transition-colors"></div>
              <Wand2 className="h-6 w-6 text-[#C17E3D] group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="text-xl font-bold text-[#C17E3D]">Daryl Blancaflor</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/projects" className="text-[#FAE3C6] hover:text-[#C17E3D] transition-colors relative group">
              Projects
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-700 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="#contact" className="text-[#FAE3C6] hover:text-[#C17E3D] transition-colors relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-700 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-[#B97452]/50 text-[#C17E3D] hover:bg-[#B97452]/80 hover:border-[#C17E3D] bg-[#222B39]"
              >
                Dashboard
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#C17E3D] p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 bg-[#222B39]/95 backdrop-blur-lg z-40 flex flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden",
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      >
        <Link
          href="#projects"
          className="text-2xl text-[#C17E3D] hover:text-[#C17E3D]/80 transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          Projects
        </Link>
        <Link
          href="#contact"
          className="text-2xl text-[#C17E3D] hover:text-[#C17E3D]/80 transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          Contact
        </Link>
        <Link
          href="/dashboard"
          className="text-2xl text-[#C17E3D] hover:text-[#C17E3D]/80 transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          Dashboard
        </Link>
      </div>
    </header>
  )
}
