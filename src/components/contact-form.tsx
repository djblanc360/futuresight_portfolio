"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles } from "lucide-react"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      // Reset form after showing success message
      setTimeout(() => {
        setIsSubmitted(false)
      }, 3000)
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Input
            placeholder="Your Name"
            className="bg-[#222B39] border-[#B97452]/30 focus:border-[#C17E3D] text-[#FAE3C6] placeholder:text-[#FAE3C6]/50 h-12"
            required
            disabled={isSubmitting}
          />
          <div className="absolute inset-0 border border-[#B97452]/0 group-focus-within:border-[#B97452]/50 rounded-md pointer-events-none"></div>
        </div>

        <div className="relative">
          <Input
            type="email"
            placeholder="Your Email"
            className="bg-[#222B39] border-[#B97452]/30 focus:border-[#C17E3D] text-[#FAE3C6] placeholder:text-[#FAE3C6]/50 h-12"
            required
            disabled={isSubmitting}
          />
          <div className="absolute inset-0 border border-[#B97452]/0 group-focus-within:border-[#B97452]/50 rounded-md pointer-events-none"></div>
        </div>

        <div className="relative">
          <Textarea
            placeholder="Your Message"
            className="bg-[#222B39] border-[#B97452]/30 focus:border-[#C17E3D] text-[#FAE3C6] placeholder:text-[#FAE3C6]/50 min-h-[150px] resize-none"
            required
            disabled={isSubmitting}
          />
          <div className="absolute inset-0 border border-[#B97452]/0 group-focus-within:border-[#B97452]/50 rounded-md pointer-events-none"></div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#B97452] hover:bg-[#C17E3D] text-[#FAE3C6] border border-[#C17E3D]/50 shadow-lg shadow-[#B97452]/30 h-12 relative overflow-hidden group"
        disabled={isSubmitting || isSubmitted}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-[#FAE3C6] border-t-transparent rounded-full"></span>
            Sending...
          </span>
        ) : isSubmitted ? (
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Message Sent!
          </span>
        ) : (
          <span>Send Message</span>
        )}

        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#B97452]/0 via-[#C17E3D]/30 to-[#B97452]/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
      </Button>
    </form>
  )
}
