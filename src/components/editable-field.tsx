"use client"

import { useState, useRef, useEffect } from "react"
import { SquarePen, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

type FieldType = "text" | "textarea" | "date" | "url"

interface EditableFieldProps {
  value: string
  onSave: (value: string) => Promise<void>
  fieldType?: FieldType
  label?: string
  placeholder?: string
  className?: string
  displayClassName?: string
  inputClassName?: string
  renderDisplay?: (value: string) => React.ReactNode
  isEditable?: boolean
}

export function EditableField({
  value,
  onSave,
  fieldType = "text",
  label,
  placeholder = "Enter value...",
  className = "",
  displayClassName = "",
  inputClassName = "",
  renderDisplay,
  isEditable = true,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (fieldType !== "date") {
        inputRef.current.select()
      }
    }
  }, [isEditing, fieldType])

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      await onSave(editValue)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to save:", error)
      setEditValue(value)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && fieldType !== "textarea") {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  if (!isEditable) {
    return (
      <div className={className}>
        {label && <span className="text-sm font-medium text-[#FAE3C6]/60 block mb-1">{label}</span>}
        <div className={displayClassName}>
          {renderDisplay ? renderDisplay(value) : value || "-"}
        </div>
      </div>
    )
  }

  if (isEditing) {
    const baseInputClass = cn(
      "w-full px-3 py-2 bg-[#1a1f2e] border border-[#B97452]/50 rounded-lg",
      "text-[#FAE3C6] placeholder:text-[#FAE3C6]/40",
      "focus:outline-none focus:border-[#C17E3D] focus:ring-1 focus:ring-[#C17E3D]/30",
      "transition-colors",
      inputClassName
    )

    return (
      <div className={cn("space-y-2", className)}>
        {label && <span className="text-sm font-medium text-[#FAE3C6]/60 block">{label}</span>}
        
        {fieldType === "textarea" ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={8}
            className={cn(baseInputClass, "resize-y min-h-[120px]")}
            disabled={isSaving}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={fieldType === "date" ? "date" : fieldType === "url" ? "url" : "text"}
            value={fieldType === "date" && editValue ? editValue.split("T")[0] : editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={baseInputClass}
            disabled={isSaving}
          />
        )}

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="p-1.5 rounded-md text-[#FAE3C6]/60 hover:text-[#FAE3C6] hover:bg-[#B97452]/20 transition-colors disabled:opacity-50"
            title="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="p-1.5 rounded-md text-[#C17E3D] hover:text-[#FAE3C6] hover:bg-[#B97452]/30 transition-colors disabled:opacity-50"
            title="Save"
          >
            <Check className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("group", className)}>
      {label && <span className="text-sm font-medium text-[#FAE3C6]/60 block mb-1">{label}</span>}
      <div className="flex items-start gap-2">
        <div className={cn("flex-1", displayClassName)}>
          {renderDisplay ? renderDisplay(value) : value || <span className="text-[#FAE3C6]/40">{placeholder}</span>}
        </div>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-[#C17E3D]/70 hover:text-[#C17E3D] hover:bg-[#B97452]/20 transition-all cursor-pointer"
          title="Edit"
        >
          <SquarePen className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

