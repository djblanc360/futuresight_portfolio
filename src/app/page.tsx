import Image from "next/image"
import Link from "next/link"


import { Github, Linkedin, Mail } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { MagicHeader } from "@/components/magic-header"
import { Hero } from "@/components/hero"
import { ExperienceConstellation } from "@/components/experience-constellation"
import { MagicalSkillCards } from "@/components/magical-skill-card"
import { StarryBackgroundAnimated } from "@/components/starry-background-animated"
import { StarryBackground } from "@/components/starry-background"
import { ProjectHighlights } from "@/components/project-highlights"

export default function Home() {

  return (
    <div className="min-h-screen bg-[#030304] text-[#FAE3C6] font-serif">
      <MagicHeader />

      {/* Combined Hero and Projects Background */}
      <div className="relative">
        <div className="absolute inset-0 z-0">
          <StarryBackgroundAnimated />
        </div>

        {/* Hero Section */}
        <Hero />

        {/* Projects Section */}
        <section id="projects" className="py-20 relative">
          <ProjectHighlights />
        </section>
      </div>

      {/* Skills Section */}
      <section className="py-20 bg-[#030304] relative">
        <div className="absolute inset-0 bg-[url('/images/magical-bg.png')] opacity-5 bg-repeat"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#C17E3D] mb-4">Magical Arsenal</h2>
            <p className="text-[#FAE3C6]/70 max-w-2xl mx-auto">
              The mystical tools and enchanted technologies I wield to create digital wonders.
            </p>
          </div>

          <MagicalSkillCards />
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-[#030304] relative">
        <StarryBackground />
        <div className="absolute inset-0 bg-[url('/images/magical-bg.png')] opacity-5 bg-repeat"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#C17E3D] mb-4">Mystical Journey</h2>
            <p className="text-[#FAE3C6]/70 max-w-2xl mx-auto">
              Navigate through the constellation of my professional experience.
            </p>
          </div>

          <ExperienceConstellation />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#030304] relative">
        <div className="absolute inset-0 bg-[url('/images/magical-bg.png')] opacity-5 bg-repeat"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#C17E3D] mb-4">Send an Owl</h2>
            <p className="text-[#FAE3C6]/70 max-w-2xl mx-auto">
              Having visions of a future project? Let&apos;s collaborate and bring it to life.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="space-y-8">
              <div className="relative">
                <Image
                  src="/images/side-profile.png"
                  alt="Developer Profile"
                  width={400}
                  height={600}
                  className="rounded-lg shadow-xl shadow-[#B97452]/50 border-2 border-[#B97452]/50 mx-auto"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#B97452]/20 rounded-full blur-xl"></div>
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#B97452]/20 rounded-full blur-xl"></div>
              </div>

              <div className="flex justify-center gap-4">
                <Link
                  href="https://github.com"
                  className="p-3 bg-[#222B39] rounded-full border border-[#B97452]/30 hover:border-[#C17E3D] transition-colors"
                >
                  <Github className="h-6 w-6 text-[#C17E3D]" />
                  <span className="sr-only">GitHub</span>
                </Link>
                <Link
                  href="https://linkedin.com"
                  className="p-3 bg-[#222B39] rounded-full border border-[#B97452]/30 hover:border-[#C17E3D] transition-colors"
                >
                  <Linkedin className="h-6 w-6 text-[#C17E3D]" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
                <Link
                  href="mailto:example@example.com"
                  className="p-3 bg-[#222B39] rounded-full border border-[#B97452]/30 hover:border-[#C17E3D] transition-colors"
                >
                  <Mail className="h-6 w-6 text-[#C17E3D]" />
                  <span className="sr-only">Email</span>
                </Link>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#B97452]/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#FAE3C6]/50">© {new Date().getFullYear()} Magical Developer. All rights reserved.</p>
          <p className="text-[#FAE3C6]/30 text-sm mt-2">Crafted with ✨ and code</p>
        </div>
      </footer>
    </div>
  )
}
