import { drizzle } from "drizzle-orm/vercel-postgres"
import { sql } from "@vercel/postgres"
import * as schema from "./schema"

// Create a Drizzle ORM instance with Vercel Postgres
let db: ReturnType<typeof drizzle>

try {
  // Create a Drizzle ORM instance using Vercel Postgres
  db = drizzle()

  console.log("Database connection initialized successfully with Vercel Postgres")
} catch (error) {
  console.error("Failed to initialize database connection:", error)
  // Create a placeholder db object that will throw clear errors
  db = new Proxy({} as ReturnType<typeof drizzle>, {
    get: (target, prop) => {
      if (prop === "then") return undefined // For promise checking
      throw new Error(`Database not initialized. Original error: ${error as string}`)
    },
  })
}

export { db }
