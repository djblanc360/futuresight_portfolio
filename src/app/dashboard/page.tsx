import type { Metadata } from "next"
import { MagicHeader } from "@/components/magic-header"
import { StarryBackground } from "@/components/starry-background"
import { DashboardContent } from "@/components/dashboard-content"

export const metadata: Metadata = {
  title: "Dashboard | Magical Portfolio",
  description: "Manage your magical portfolio content",
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#030304] text-[#FAE3C6] font-serif">
      <MagicHeader />

      <div className="relative pt-20">
        <div className="absolute inset-0 z-0">
          <StarryBackground />
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#C17E3D] mb-4">Dashboard</h1>
            <p className="text-xl text-[#FAE3C6]/80">Manage your magical portfolio content and skills</p>
          </div>

          <DashboardContent />
        </div>
      </div>
    </div>
  )
}
