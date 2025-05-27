"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface MDXContentProps {
  content: string
}

export function MDXContent({ content }: MDXContentProps) {
  const [renderedContent, setRenderedContent] = useState("")

  useEffect(() => {
    // Simple markdown parser for demonstration purposes
    // In a real app, you'd use a proper markdown parser like remark/rehype
    const parsedContent = content
      // Headers
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-[#C17E3D] mt-8 mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-[#C17E3D] mt-6 mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold text-[#C17E3D] mt-5 mb-2">$1</h3>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Lists
      .replace(/^- (.*$)/gm, '<li class="ml-6 list-disc text-[#FAE3C6]/90">$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-6 list-decimal text-[#FAE3C6]/90">$1. $2</li>')
      // Links
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" class="text-[#C17E3D] hover:underline">$1</a>')
      // Images
      .replace(
        /!\[(.*?)\]$$(.*?)$$/g,
        '<div class="my-6"><img src="$2" alt="$1" class="rounded-lg shadow-lg border border-[#B97452]/30" /></div>',
      )
      // Paragraphs
      .replace(/^(?!<[hl]|<li|<div|<img)(.+)/gm, '<p class="mb-4 text-[#FAE3C6]/90">$1</p>')
      // Fix lists
      .replace(
        /<li class="ml-6 list-disc text-\[#FAE3C6\]\/90">(.*?)<\/li>\n<li class="ml-6 list-disc text-\[#FAE3C6\]\/90">/g,
        '<li class="ml-6 list-disc text-[#FAE3C6]/90">$1</li>\n<li class="ml-6 list-disc text-[#FAE3C6]/90">',
      )
      .replace(
        /<li class="ml-6 list-disc text-\[#FAE3C6\]\/90">(.*?)<\/li>/g,
        '<ul class="my-4 space-y-1"><li class="ml-6 list-disc text-[#FAE3C6]/90">$1</li></ul>',
      )
      .replace(/<\/ul>\n<ul class="my-4 space-y-1">/g, "")

    setRenderedContent(parsedContent)
  }, [content])

  return (
    <div
      className={cn("mdx-content text-[#FAE3C6]/90 leading-relaxed")}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  )
}
