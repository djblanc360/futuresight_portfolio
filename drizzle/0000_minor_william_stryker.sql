CREATE TABLE "portfolio_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"company" text NOT NULL,
	"date" timestamp,
	"description" text NOT NULL,
	"github_url" text,
	"demo_url" text,
	"image_url" text,
	"case_study" text,
	"featured" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "portfolio_projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "portfolio_projects_to_skills" (
	"project_id" integer NOT NULL,
	"skill_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"categories" text NOT NULL,
	"level" integer NOT NULL,
	"icon" text,
	"color" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "portfolio_skills_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "portfolio_projects_to_skills" ADD CONSTRAINT "portfolio_projects_to_skills_project_id_portfolio_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_projects_to_skills" ADD CONSTRAINT "portfolio_projects_to_skills_skill_id_portfolio_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."portfolio_skills"("id") ON DELETE no action ON UPDATE no action;