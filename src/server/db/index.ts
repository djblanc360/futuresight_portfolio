// import { drizzle } from "drizzle-orm/vercel-postgres"
// import { sql } from "@vercel/postgres"
// import * as schema from "./schema"

// let db: ReturnType<typeof drizzle>

// try {
//   db = drizzle()

//   console.log("Database connection initialized successfully with Vercel Postgres")
// } catch (error) {
//   console.error("Failed to initialize database connection:", error)
//   // Create a placeholder db object that will throw clear errors
//   db = new Proxy({} as ReturnType<typeof drizzle>, {
//     get: (target, prop) => {
//       if (prop === "then") return undefined // For promise checking
//       throw new Error(`Database not initialized. Original error: ${error as string}`)
//     },
//   })
// }

// export { db }
// src/db.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" }); // or .env.local

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });