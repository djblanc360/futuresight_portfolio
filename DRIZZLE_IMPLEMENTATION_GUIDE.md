# Drizzle ORM Implementation Guide

## Overview

This project uses **Drizzle ORM** with **Neon** (serverless PostgreSQL) for database management. The implementation follows a clean architecture pattern with schema definitions, database connection, seeding, and query functions.

## Architecture

```
src/server/
├── db/
│   ├── index.ts      # Database connection initialization
│   ├── schema.ts      # Table definitions and relations
│   └── seed.ts        # Database seeding function
├── queries.ts         # Cached query functions (via API routes)
└── mock-data.ts       # Seed data
```

---

## 1. Database Connection (`src/server/db/index.ts`)

### Current Implementation

```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" }); // Load environment variables

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
```

### How It Works

1. **Neon Client**: Uses `@neondatabase/serverless` to create a serverless PostgreSQL client
2. **Connection String**: Reads `DATABASE_URL` from environment variables
3. **Drizzle Instance**: Creates a Drizzle ORM instance with the Neon client
4. **Export**: The `db` instance is exported and used throughout the application

### Environment Setup

Ensure your `.env` file contains:
```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

---

## 2. Schema Definition (`src/server/db/schema.ts`)

### Tables

#### Projects Table
```typescript
export const projects = pgTable("portfolio_projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  company: text("company").notNull(),
  date: timestamp("date").notNull(),
  description: text("description").notNull(),
  githubUrl: text("github_url"),
  demoUrl: text("demo_url"),
  imageUrl: text("image_url"),
  caseStudy: text("case_study").notNull(),
  featured: integer("featured").default(0),
  createdAt: timestamp("created_at").defaultNow(),
})
```

#### Skills Table
```typescript
export const skills = pgTable("portfolio_skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  categories: text("categories").notNull(), // JSON array stored as text
  level: integer("level").notNull(),
  icon: text("icon"),
  color: text("color"),
  createdAt: timestamp("created_at").defaultNow(),
})
```

#### Many-to-Many Relationship Table
```typescript
export const projectsToSkills = pgTable("portfolio_projects_to_skills", {
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id),
  skillId: integer("skill_id")
    .notNull()
    .references(() => skills.id),
})
```

### Relations

Drizzle relations define the relationships between tables:

```typescript
// Projects can have many project-skill relationships
export const projectsRelations = relations(projects, ({ many }) => ({
  skills: many(projectsToSkills),
}))

// Skills can have many project-skill relationships
export const skillsRelations = relations(skills, ({ many }) => ({
  projects: many(projectsToSkills),
}))

// Each relationship connects one project to one skill
export const projectsToSkillsRelations = relations(projectsToSkills, ({ one }) => ({
  project: one(projects, {
    fields: [projectsToSkills.projectId],
    references: [projects.id],
  }),
  skill: one(skills, {
    fields: [projectsToSkills.skillId],
    references: [skills.id],
  }),
}))
```

---

## 3. Database Initialization

### Step 1: Create Database Tables

You have two options:

#### Option A: Push Schema Directly (Recommended for Development)
```bash
pnpm db:push
```
This command:
- Reads the schema from `src/server/db/schema.ts`
- Creates/updates tables directly in the database
- No migration files needed
- Fast and simple for development

#### Option B: Generate and Run Migrations (Recommended for Production)
```bash
# Generate migration files
pnpm db:generate

# Apply migrations to database
pnpm db:migrate
```
This approach:
- Creates migration files in `drizzle/` directory
- Allows version control of schema changes
- Better for production environments

### Step 2: Verify Tables

You can use Drizzle Studio to inspect your database:
```bash
pnpm db:studio
```
This opens a web UI at `http://localhost:4983` where you can:
- View all tables
- Browse data
- Run queries
- Edit records

---

## 4. Database Seeding (`src/server/db/seed.ts`)

### Seed Function Overview

The `seed()` function:
1. **Clears existing data** (in reverse order of dependencies)
2. **Inserts skills** and maps old IDs to new IDs
3. **Inserts projects** and maps old IDs to new IDs
4. **Inserts relationships** using the mapped IDs

### How Seeding Works

```typescript
export async function seed() {
  // 1. Clear existing data (order matters due to foreign keys)
  await db.delete(projectsToSkills)  // Delete relationships first
  await db.delete(projects)          // Then projects
  await db.delete(skills)            // Finally skills

  // 2. Insert skills and track ID mappings
  const skillIdMap = new Map<number, number>()
  for (const skill of skillsData) {
    const [inserted] = await db
      .insert(skills)
      .values({ /* ... */ })
      .returning()
    
    skillIdMap.set(skill.id, inserted.id) // Map old ID → new ID
  }

  // 3. Insert projects and track ID mappings
  const projectIdMap = new Map<number, number>()
  for (const project of projectsData) {
    const [inserted] = await db
      .insert(projects)
      .values({ /* ... */ })
      .returning()
    
    projectIdMap.set(project.id, inserted.id) // Map old ID → new ID
  }

  // 4. Insert relationships using mapped IDs
  for (const relation of projectsToSkillsData) {
    const newProjectId = projectIdMap.get(relation.projectId)
    const newSkillId = skillIdMap.get(relation.skillId)
    
    if (newProjectId && newSkillId) {
      await db.insert(projectsToSkills).values({
        projectId: newProjectId,
        skillId: newSkillId,
      })
    }
  }
}
```

### Why ID Mapping?

The seed data uses hardcoded IDs (e.g., `id: 1, 2, 3`), but when inserting into the database:
- Auto-increment IDs are generated (e.g., `1, 2, 3` might become `101, 102, 103`)
- The relationship data references the old IDs
- We need to map old IDs → new IDs to maintain relationships

### Running the Seed

#### Via API Endpoint
```bash
# Start your Next.js dev server
pnpm dev

# In another terminal or browser
GET http://localhost:3000/api/seed
```

#### Via Seed Page
Navigate to: `http://localhost:3000/seed`

#### Programmatically
```typescript
import { seed } from "@/server/db/seed"

await seed()
```

---

## 5. Query Patterns

### Direct Database Queries (API Routes)

Used in `src/app/api/projects/route.ts` and `src/app/api/skills/route.ts`:

```typescript
// Simple select
const allSkills = await db.select().from(skills)

// Select with joins
const result = await db
  .select({
    project: projects,
    skill: skills,
  })
  .from(projects)
  .leftJoin(projectsToSkills, eq(projects.id, projectsToSkills.projectId))
  .leftJoin(skills, eq(projectsToSkills.skillId, skills.id))
  .where(eq(projects.slug, slug))

// Insert with returning
const [newProject] = await db
  .insert(projects)
  .values({ /* ... */ })
  .returning()

// Delete
await db.delete(projectsToSkills)
```

### Cached Queries (Server Components)

Used in `src/server/queries.ts`:

```typescript
export const getProjects = cache(async (): Promise<ProjectWithSkills[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/projects`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })
  return res.json()
})
```

**Note**: The current implementation uses API routes for queries, which is good for:
- Caching
- Edge runtime compatibility
- Separation of concerns

---

## 6. Drizzle Configuration (`drizzle.config.ts`)

```typescript
export default {
  schema: "./src/server/db/schema.ts",  // Path to schema file
  dialect: "postgresql",                 // Database type
  dbCredentials: {
    url: env.DATABASE_URL,               // Connection string
  },
  tablesFilter: ["portfolio_*"],         // Only manage tables with this prefix
} satisfies Config;
```

---

## 7. Common Workflow

### Initial Setup
```bash
# 1. Set up environment variables
echo "DATABASE_URL=your_connection_string" > .env

# 2. Create database tables
pnpm db:push

# 3. Seed the database
# (via API: GET /api/seed or visit /seed page)
```

### Making Schema Changes
```bash
# 1. Update schema.ts
# 2. Push changes to database
pnpm db:push

# OR generate migration
pnpm db:generate
pnpm db:migrate
```

### Reseeding Database
```bash
# Just call the seed endpoint again
GET /api/seed
```

---

## 8. Troubleshooting

### Error: "relation does not exist"
**Solution**: Run `pnpm db:push` to create the tables first.

### Error: "duplicate key value violates unique constraint"
**Solution**: The seed function clears existing data, but if it fails partway through, you may need to manually clear tables or fix the seed data.

### Error: "foreign key constraint violation"
**Solution**: Ensure you're deleting/inserting in the correct order:
1. Delete relationships first
2. Then parent tables
3. Insert parents first
4. Then relationships

---

## 9. Key Concepts

### Type Safety
Drizzle provides full TypeScript type inference:
```typescript
const project = await db.select().from(projects).where(eq(projects.id, 1))
// project is automatically typed as Project[]
```

### SQL-like Syntax
Drizzle queries look like SQL but are type-safe:
```typescript
db.select()
  .from(projects)
  .where(eq(projects.featured, 1))
  .orderBy(desc(projects.date))
```

### Relations vs Joins
- **Relations**: Define relationships for type inference and query helpers
- **Joins**: Explicitly join tables in queries (what you actually use in API routes)

---

## Summary

1. **Connection**: `src/server/db/index.ts` initializes Drizzle with Neon
2. **Schema**: `src/server/db/schema.ts` defines tables and relations
3. **Initialize**: Run `pnpm db:push` to create tables
4. **Seed**: Call `/api/seed` endpoint to populate data
5. **Query**: Use `db` instance in API routes for database operations

The implementation follows best practices for Next.js serverless environments with type-safe database operations.

