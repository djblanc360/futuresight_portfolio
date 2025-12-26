"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import Image from "next/image"
import { Upload, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageDropzoneProps {
  currentImage?: string | null
  onImageChange: (imageUrl: string | null) => void
  onCancel?: () => void
  className?: string
  /** When true, hides action buttons and updates parent immediately on image selection */
  inline?: boolean
}

export function ImageDropzone({
  currentImage,
  onImageChange,
  onCancel,
  className = "",
  inline = false,
}: ImageDropzoneProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [isDragging, setIsDragging] = useState(false)
  const [urlInput, setUrlInput] = useState(currentImage || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync preview with currentImage prop changes (for controlled mode)
  useEffect(() => {
    setPreview(currentImage || null)
    setUrlInput(currentImage || "")
  }, [currentImage])

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
      handleFile(files[0]!)
    }
  }, [])

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setPreview(dataUrl)
      setUrlInput(dataUrl)
      // In inline mode, update parent immediately
      if (inline) {
        onImageChange(dataUrl)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0]!)
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      const url = urlInput.trim()
      setPreview(url)
      // In inline mode, update parent immediately
      if (inline) {
        onImageChange(url)
      }
    }
  }

  const handleSave = () => {
    onImageChange(preview)
  }

  const handleClear = () => {
    setPreview(null)
    setUrlInput("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    // In inline mode, update parent immediately
    if (inline) {
      onImageChange(null)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* URL Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Enter image URL or drag & drop below"
          className="flex-1 px-3 py-2 bg-[#1a1f2e] border border-[#B97452]/30 rounded-lg text-[#FAE3C6] placeholder:text-[#FAE3C6]/40 focus:outline-none focus:border-[#C17E3D]"
        />
        <Button
          type="button"
          onClick={handleUrlSubmit}
          variant="outline"
          className="border-[#B97452] text-[#C17E3D] hover:bg-[#B97452]/20"
        >
          Load
        </Button>
      </div>

      {/* Dropzone */}
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
          onChange={handleFileInput}
          className="hidden"
        />
        
        {preview ? (
          <div className="relative">
            <Image
              src={preview}
              alt="Preview"
              width={400}
              height={240}
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full hover:bg-black/80 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-[#FAE3C6]/60">
            <div className="p-3 bg-[#B97452]/20 rounded-full mb-3">
              {isDragging ? (
                <Upload className="h-6 w-6 text-[#C17E3D]" />
              ) : (
                <ImageIcon className="h-6 w-6 text-[#C17E3D]" />
              )}
            </div>
            <p className="text-sm font-medium">
              {isDragging ? "Drop image here" : "Click or drag image to upload"}
            </p>
            <p className="text-xs mt-1 text-[#FAE3C6]/40">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons - only shown in non-inline mode */}
      {!inline && onCancel && (
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="border-[#B97452]/50 text-[#FAE3C6]/70 hover:bg-[#B97452]/10"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-[#B97452] hover:bg-[#C17E3D] text-[#FAE3C6]"
          >
            Save Image
          </Button>
        </div>
      )}
    </div>
  )
}

