"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

export default function SeedPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSeed = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/seed")
      const data = await response.json()

      setResult({
        success: data.success,
        message: data.success ? "Database seeded successfully!" : data.error || "Failed to seed database",
      })
    } catch (error) {
      setResult({
        success: false,
        message: "An error occurred while seeding the database",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#030304] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#222B39] border-[#B97452]/30 text-[#FAE3C6]">
        <CardHeader>
          <CardTitle className="text-[#C17E3D]">Seed Database</CardTitle>
          <CardDescription className="text-[#FAE3C6]/70">
            This will populate your database with sample projects and skills data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-[#FAE3C6]/80">
            Click the button below to seed your database with sample data. This will:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#FAE3C6]/80">
            <li>Clear any existing projects and skills data</li>
            <li>Add sample projects with case studies</li>
            <li>Add sample skills with categories</li>
            <li>Create relationships between projects and skills</li>
          </ul>

          {result && (
            <div
              className={`mt-6 p-4 rounded-md ${
                result.success ? "bg-green-900/20 border border-green-800/50" : "bg-red-900/20 border border-red-800/50"
              }`}
            >
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <p className={result.success ? "text-green-400" : "text-red-400"}>{result.message}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSeed}
            disabled={isLoading}
            className="w-full bg-[#B97452] hover:bg-[#C17E3D] text-[#FAE3C6]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Seeding Database...
              </>
            ) : (
              "Seed Database"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
