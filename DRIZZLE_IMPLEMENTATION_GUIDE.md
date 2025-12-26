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

## 5. Data Fetching Architecture

This project uses a hybrid approach for data fetching:

### 5.1 Server-Side (React Server Components)

**Location**: `src/server/queries.ts`

Used for initial page loads and SEO. These functions use Next.js's `cache()` and `fetch()` with revalidation:

```typescript
export const getProjects = cache(async (): Promise<ProjectWithSkills[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/projects`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })
  return res.json()
})
```

**Use cases**:
- Server-side rendering (SSR)
- Static site generation (SSG)
- Initial page data
- SEO-critical content

### 5.2 Client-Side (TanStack Query)

**Location**: `src/hooks/use-projects.ts` and `src/hooks/use-skills.ts`

Used for client-side data fetching, mutations, and real-time updates. TanStack Query provides:
- Automatic caching
- Background refetching
- Optimistic updates
- Request deduplication
- Retry logic

#### Query Hooks

```typescript
// Fetch projects
const { data: projects, isLoading, error } = useProjects()

// Fetch featured projects
const { data: featuredProjects } = useProjects(true)

// Fetch skills
const { data: skills } = useSkills()
```

#### Mutation Hooks

```typescript
// Create project
const createProject = useCreateProject()
await createProject.mutateAsync({
  title: "New Project",
  slug: "new-project",
  // ... other fields
})

// Create skill
const createSkill = useCreateSkill()
await createSkill.mutateAsync({
  name: "TypeScript",
  categories: ["Frontend"],
  level: 85,
})

// Delete operations
const deleteProject = useDeleteProject()
await deleteProject.mutateAsync(projectId)
```

**Benefits**:
- Automatic cache invalidation after mutations
- Loading and error states built-in
- Prevents duplicate requests
- Background refetching
- Stale-while-revalidate pattern

### 5.3 Direct Database Queries (API Routes)

**Location**: `src/app/api/projects/route.ts` and `src/app/api/skills/route.ts`

API routes handle direct database operations using Drizzle ORM:

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

### 5.4 TanStack Query Configuration

**Location**: `src/lib/providers.tsx`

Global configuration for TanStack Query:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (garbage collection)
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
})
```

### 5.5 React Server Actions

**Location**: `src/server/actions.ts`

Mutations (create/update/delete) are handled by React Server Actions:

```typescript
"use server"

import { eq } from "drizzle-orm"
import { db } from "./db"
import { projects, skills } from "./db/schema"
import { revalidatePath } from "next/cache"

export async function createProject(projectData: {...}) {
  const [newProject] = await db.insert(projects).values({...}).returning()
  revalidatePath("/")
  revalidatePath("/dashboard")
  return newProject
}

export async function deleteProject(id: number) {
  await db.delete(projects).where(eq(projects.id, id))
  revalidatePath("/")
  revalidatePath("/dashboard")
  return { success: true }
}
```

Use with TanStack Query `useMutation`:

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProject } from "@/server/actions"

const queryClient = useQueryClient()

const mutation = useMutation({
  mutationFn: createProject,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["projects"] })
  },
})
```

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

### When to Use Each Data Fetching Method

| Method | Use Case | Example |
|--------|----------|---------|
| **Server Queries** (`src/server/queries.ts`) | Initial page load, SSR, SSG | Homepage project list |
| **TanStack Query Hooks** (`src/hooks/*`) | Client components, interactive UI | Dashboard, forms, real-time updates |
| **Direct DB Queries** (`src/app/api/*/route.ts`) | API endpoints, backend logic | Create/update/delete operations |

---

## 10. Example Usage

### Server Component (SSR)

```typescript
// app/page.tsx
import { getFeaturedProjects } from "@/server/queries"

export default async function HomePage() {
  const projects = await getFeaturedProjects()
  return <ProjectList projects={projects} />
}
```

### Client Component (Interactive)

Following the [TanStack Query Quick Start](https://tanstack.com/query/latest/docs/framework/react/quick-start) pattern:

```typescript
// components/dashboard.tsx
"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createProject } from "@/server/actions"
import type { Project } from "@/types/projects"

export function Dashboard() {
  const queryClient = useQueryClient()

  // Query - direct usage
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects")
      if (!res.ok) throw new Error("Failed to fetch")
      return res.json() as Promise<Project[]>
    },
  })

  // Mutation with server action
  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })

  const handleCreate = async (data) => {
    await mutation.mutateAsync(data)
  }

  if (isLoading) return <div>Loading...</div>
  return <div>{/* ... */}</div>
}
```

---

## Summary

1. **Connection**: `src/server/db/index.ts` initializes Drizzle with Neon
2. **Schema**: `src/server/db/schema.ts` defines tables and relations
3. **Initialize**: Run `pnpm db:push` to create tables
4. **Seed**: Call `/api/seed` endpoint to populate data
5. **Server Queries**: Use `src/server/queries.ts` for RSC data fetching
6. **Server Actions**: Use `src/server/actions.ts` for mutations
7. **Client Queries**: Use `useQuery`/`useMutation` directly in components

The implementation follows best practices for Next.js with:
- Type-safe database operations (Drizzle ORM)
- Server-side rendering (React Server Components)
- React Server Actions for mutations
- TanStack Query for client-side caching
- Automatic cache invalidation via `queryClient.invalidateQueries()`

