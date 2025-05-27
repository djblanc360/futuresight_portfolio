import { relations } from "drizzle-orm"
import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core"

// Define the projects table with portfolio_ prefix
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

// Define the skills table with portfolio_ prefix
export const skills = pgTable("portfolio_skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category").notNull(),
  level: integer("level").notNull(),
  icon: text("icon"),
  color: text("color"),
  createdAt: timestamp("created_at").defaultNow(),
})

// Define the many-to-many relationship table with portfolio_ prefix
export const projectsToSkills = pgTable("portfolio_projects_to_skills", {
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id),
  skillId: integer("skill_id")
    .notNull()
    .references(() => skills.id),
})

// Define relations
export const projectsRelations = relations(projects, ({ many }) => ({
  skills: many(projectsToSkills),
}))

export const skillsRelations = relations(skills, ({ many }) => ({
  projects: many(projectsToSkills),
}))

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

// Types for our schema
export type Project = typeof projects.$inferSelect
export type Skill = typeof skills.$inferSelect
export type ProjectToSkill = typeof projectsToSkills.$inferSelect

// Extended types with relations
export interface ProjectWithSkills extends Project {
  skills: Skill[]
}

export interface SkillWithProjects extends Skill {
  projects: Project[]
}
