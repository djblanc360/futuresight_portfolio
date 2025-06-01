"use client"

import { DraggableTarotCards } from "./draggable-tarot-cards";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function Hero() {
    const router = useRouter();

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            <div className="container mx-auto px-4 py-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6 text-center lg:text-left">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#C17E3D]">
                            <span className="block">Crafting Digital</span>
                            <span className="block mt-2">Magic with Code</span>
                        </h1>
                        <p className="text-xl text-[#FAE3C6]/80 max-w-xl mx-auto lg:mx-0">
                            Fullstack developer conjuring elegant solutions through the art of programming. Transforming ideas
                            into digital reality.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                            <Button onClick={() => router.push("/projects")} className="bg-[#B97452] hover:bg-[#C17E3D] text-[#FAE3C6] border border-[#C17E3D]/50 shadow-lg shadow-[#B97452]/30">
                            View My Work
                            </Button>
                            <Button onClick={() => router.push("/#contact")} variant="outline" className="bg-[#222B39] border-[#B97452] text-[#C17E3D] hover:bg-[#B97452]/80">
                            Contact Me
                            </Button>
                        </div>
                    </div>

                    <DraggableTarotCards />
                </div>
            </div>
        </section>
    )
}