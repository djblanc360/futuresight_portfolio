"use client"

import { useState, useCallback, useRef } from "react"
import Image from "next/image"
import { Upload, X, ImageIcon, Plus, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MultiImageDropzoneProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  className?: string
}

export function MultiImageDropzone({
  images,
  onImagesChange,
  maxImages = 10,
  className = "",
}: MultiImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFiles(Array.from(files))
    }
  }, [images, maxImages])

  const handleFiles = (files: File[]) => {
    const remainingSlots = maxImages - images.length
    const filesToProcess = files.slice(0, remainingSlots)

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        onImagesChange([...images, dataUrl])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(Array.from(files))
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUrlAdd = () => {
    if (urlInput.trim() && images.length < maxImages) {
      onImagesChange([...images, urlInput.trim()])
      setUrlInput("")
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  // Drag reordering handlers
  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newImages = [...images]
    const draggedImage = newImages[draggedIndex]!
    newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, draggedImage)
    setDraggedIndex(index)
    onImagesChange(newImages)
  }

  const handleImageDragEnd = () => {
    setDraggedIndex(null)
  }

  const canAddMore = images.length < maxImages

  return (
    <div className={`space-y-4 ${className}`}>
      {/* URL Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleUrlAdd()
            }
          }}
          placeholder="Enter image URL and press Enter or click Add"
          disabled={!canAddMore}
          className="flex-1 px-3 py-2 bg-[#1a1f2e] border border-[#B97452]/30 rounded-lg text-[#FAE3C6] placeholder:text-[#FAE3C6]/40 focus:outline-none focus:border-[#C17E3D] disabled:opacity-50"
        />
        <Button
          type="button"
          onClick={handleUrlAdd}
          disabled={!canAddMore || !urlInput.trim()}
          variant="outline"
          className="border-[#B97452] text-[#C17E3D] hover:bg-[#B97452]/20 disabled:opacity-50"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Image Previews Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              draggable
              onDragStart={(e) => handleImageDragStart(e, index)}
              onDragOver={(e) => handleImageDragOver(e, index)}
              onDragEnd={handleImageDragEnd}
              className={`
                relative group rounded-lg overflow-hidden border-2 transition-all cursor-move
                ${draggedIndex === index 
                  ? "border-[#C17E3D] opacity-50" 
                  : "border-[#B97452]/30 hover:border-[#B97452]/60"
                }
              `}
            >
              <div className="aspect-video relative">
                <Image
                  src={image}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Drag Handle */}
              <div className="absolute top-2 left-2 p-1 bg-black/60 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-white" />
              </div>
              
              {/* Index Badge */}
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded text-xs text-white font-medium">
                {index + 1}
              </div>
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full hover:bg-red-500/80 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone */}
      {canAddMore && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all
            ${isDragging 
              ? "border-[#C17E3D] bg-[#C17E3D]/10" 
              : "border-[#B97452]/30 hover:border-[#B97452]/60 bg-[#1a1f2e]/50"
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div className="flex flex-col items-center justify-center py-4 text-[#FAE3C6]/60">
            <div className="p-3 bg-[#B97452]/20 rounded-full mb-3">
              {isDragging ? (
                <Upload className="h-6 w-6 text-[#C17E3D]" />
              ) : (
                <ImageIcon className="h-6 w-6 text-[#C17E3D]" />
              )}
            </div>
            <p className="text-sm font-medium">
              {isDragging ? "Drop images here" : "Click or drag images to upload"}
            </p>
            <p className="text-xs mt-1 text-[#FAE3C6]/40">
              PNG, JPG, GIF up to 10MB • {images.length}/{maxImages} images
            </p>
          </div>
        </div>
      )}

      {/* Max images reached message */}
      {!canAddMore && (
        <p className="text-sm text-[#FAE3C6]/60 text-center">
          Maximum of {maxImages} images reached. Remove an image to add more.
        </p>
      )}
    </div>
  )
}



