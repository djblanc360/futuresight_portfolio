import type { Project, ProjectWithSkills, ProjectToSkill } from "@/types/projects"
import type { Skill, SkillWithProjects } from "@/types/skills"

// Skill category configuration with colors only
const skillCategoryConfig: Record<string, { color: string }> = {
  "Frontend": {
    color: "from-[#B97452] to-[#C17E3D]"
  },
  "Backend": {
    color: "from-[#C17E3D] to-[#B97452]"
  },
  "Cloud & Devops": {
    color: "from-[#FAE3C6] to-[#C17E3D]"
  },
  "Design": {
    color: "from-[#B97452] to-[#FAE3C6]"
  },
  "Ecommerce": {
    color: "from-[#C17E3D] to-[#B97452]"
  }
}

// Mock skills data
export const skillsData: Skill[] = [
  {
    id: 1,
    name: "JavaScript",
    categories: ["Frontend"],
    level: 90,
    icon: "javascript",
    color: "from-[#F7DF1E] to-[#F0DB4F]",
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Tailwind",
    categories: ["Frontend"],
    level: 90,
    icon: "tailwind",
    color: "from-[#38B2AC] to-[#0694A2]",
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "Svelte",
    categories: ["Frontend"],
    level: 80,
    icon: "svelte",
    color: "from-[#FF3E00] to-[#CC3000]",
    createdAt: new Date(),
  },
  {
    id: 4,
    name: "React",
    categories: ["Frontend"],
    level: 90,
    icon: "react",
    color: "from-[#61DAFB] to-[#2D79C7]",
    createdAt: new Date(),
  },
  {
    id: 5,
    name: "Shopify",
    categories: ["Ecommerce"],
    level: 85,
    icon: "shopify",
    color: "from-[#96BF48] to-[#7FA33A]",
    createdAt: new Date(),
  },
  {
    id: 6,
    name: "Sass",
    categories: ["Frontend"],
    level: 85,
    icon: "sass",
    color: "from-[#CC6699] to-[#A8557F]",
    createdAt: new Date(),
  },
  {
    id: 7,
    name: "PHP",
    categories: ["Backend"],
    level: 80,
    icon: "php",
    color: "from-[#777BB4] to-[#5A5F8C]",
    createdAt: new Date(),
  },
  {
    id: 8,
    name: "SQL",
    categories: ["Backend"],
    level: 85,
    icon: "database",
    color: "from-[#336791] to-[#2F5E8D]",
    createdAt: new Date(),
  },
  {
    id: 9,
    name: "AWS",
    categories: ["Cloud & Devops"],
    level: 75,
    icon: "aws",
    color: "from-[#FF9900] to-[#FF7700]",
    createdAt: new Date(),
  },
  {
    id: 10,
    name: "GraphQL",
    categories: ["Backend"],
    level: 80,
    icon: "graphql",
    color: "from-[#E535AB] to-[#B52B88]",
    createdAt: new Date(),
  },
  {
    id: 11,
    name: "REST",
    categories: ["Backend"],
    level: 90,
    icon: "api",
    color: "from-[#5A67D8] to-[#4C51BF]",
    createdAt: new Date(),
  },
  {
    id: 12,
    name: "TypeScript",
    categories: ["Frontend", "Backend"],
    level: 85,
    icon: "typescript",
    color: "from-[#3178C6] to-[#235A97]",
    createdAt: new Date(),
  },
  {
    id: 13,
    name: "Go",
    categories: ["Backend"],
    level: 75,
    icon: "go",
    color: "from-[#00ADD8] to-[#007D9C]",
    createdAt: new Date(),
  },
  {
    id: 14,
    name: "Python",
    categories: ["Backend"],
    level: 80,
    icon: "python",
    color: "from-[#3776AB] to-[#2E5F8A]",
    createdAt: new Date(),
  },
  {
    id: 15,
    name: "GSAP",
    categories: ["Frontend"],
    level: 85,
    icon: "animation",
    color: "from-[#88CE02] to-[#6BA000]",
    createdAt: new Date(),
  },
  {
    id: 16,
    name: "Motion",
    categories: ["Frontend"],
    level: 80,
    icon: "animation",
    color: "from-[#FF0055] to-[#CC0044]",
    createdAt: new Date(),
  },
  {
    id: 17,
    name: "Figma",
    categories: ["Design"],
    level: 90,
    icon: "figma",
    color: "from-[#F24E1E] to-[#C93D18]",
    createdAt: new Date(),
  },
]

// Mock projects data
export const projectsData: Project[] = [
  {
    id: 1,
    title: "Enchanted E-Commerce",
    slug: "enchanted-ecommerce",
    company: "Arcane Technologies",
    date: new Date("2023-05-15"),
    description: "A full-stack e-commerce platform with magical user experiences and seamless payment integration.",
    githubUrl: "https://github.com/example/enchanted-ecommerce",
    demoUrl: "https://enchanted-ecommerce.example.com",
    imageUrl: "/images/projects/ecommerce.jpg",
    caseStudy: `
# Enchanted E-Commerce

## Overview
Enchanted E-Commerce is a full-stack e-commerce platform designed to provide magical user experiences with seamless payment integration. The platform features a responsive design, real-time inventory management, and secure payment processing.

## Challenge
The client needed a modern e-commerce solution that could handle their growing product catalog while providing a seamless shopping experience for their customers. The existing platform was outdated and lacked modern features like real-time inventory updates and mobile responsiveness.

## Solution
I developed a custom e-commerce platform using Next.js for the frontend and Node.js with Express for the backend. The platform includes:

- Responsive design that works flawlessly on all devices
- Real-time inventory management using WebSockets
- Secure payment processing with Stripe integration
- Customer account management with order history
- Admin dashboard for product and order management

## Technologies Used
- Next.js for the frontend
- Node.js and Express for the backend
- MongoDB for the database
- Stripe for payment processing
- WebSockets for real-time updates
- Tailwind CSS for styling

## Results
The new platform resulted in a 35% increase in mobile conversions and a 25% reduction in cart abandonment rates. The client reported a significant improvement in customer satisfaction and a streamlined order management process.

![E-Commerce Dashboard](/images/projects/ecommerce-dashboard.jpg)
    `,
    featured: 1,
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "Spellbound Dashboard",
    slug: "spellbound-dashboard",
    company: "Mystic Web Solutions",
    date: new Date("2023-02-10"),
    description: "An admin dashboard with real-time analytics and interactive data visualization.",
    githubUrl: "https://github.com/example/spellbound-dashboard",
    demoUrl: "https://spellbound-dashboard.example.com",
    imageUrl: "/images/projects/dashboard.jpg",
    caseStudy: `
# Spellbound Dashboard

## Overview
Spellbound Dashboard is an admin dashboard application featuring real-time analytics and interactive data visualization. It provides businesses with insights into their operations through beautiful and intuitive visualizations.

## Challenge
The client needed a way to monitor their business metrics in real-time and make data-driven decisions quickly. Their existing reporting tools were static and required manual updates, leading to delayed insights and decision-making.

## Solution
I created a dynamic dashboard application that:

- Displays real-time data updates without page refreshes
- Features interactive charts and graphs for data exploration
- Provides customizable widgets for personalized monitoring
- Includes alert systems for critical metric thresholds
- Offers export functionality for reports and presentations

## Technologies Used
- React for the frontend
- D3.js for data visualization
- Firebase for real-time database and authentication
- Node.js for backend services
- Material-UI for component library

## Results
The dashboard has become an essential tool for the client's decision-making process, reducing the time spent on data analysis by 60% and enabling faster responses to market changes.

![Dashboard Analytics](/images/projects/dashboard-analytics.jpg)
    `,
    featured: 1,
    createdAt: new Date(),
  },
  {
    id: 3,
    title: "Mystic Messenger",
    slug: "mystic-messenger",
    company: "Enchanted Systems Inc.",
    date: new Date("2022-11-05"),
    description: "A real-time chat application with end-to-end encryption and magical animations.",
    githubUrl: "https://github.com/example/mystic-messenger",
    demoUrl: "https://mystic-messenger.example.com",
    imageUrl: "/images/projects/messenger.jpg",
    caseStudy: `
# Mystic Messenger

## Overview
Mystic Messenger is a real-time chat application featuring end-to-end encryption and magical animations. It provides a secure and engaging platform for users to communicate.

## Challenge
The client wanted a secure messaging platform that would stand out from competitors with unique visual elements while maintaining the highest standards of privacy and security.

## Solution
I developed a chat application with:

- End-to-end encryption for all messages
- Real-time message delivery and read receipts
- Custom animations for message interactions
- File sharing capabilities with preview support
- Group chat functionality with admin controls

## Technologies Used
- Socket.io for real-time communication
- Express for the backend API
- MongoDB for message storage
- React Native for mobile applications
- Web Crypto API for encryption

## Results
The application has gained a dedicated user base who appreciate both the security features and the unique visual experience, with user retention rates 40% higher than industry averages.

![Messenger Interface](/images/projects/messenger-interface.jpg)
    `,
    featured: 0,
    createdAt: new Date(),
  },
  {
    id: 4,
    title: "Arcane API",
    slug: "arcane-api",
    company: "Arcane Technologies",
    date: new Date("2022-08-20"),
    description: "A RESTful API service with comprehensive documentation and robust authentication.",
    githubUrl: "https://github.com/example/arcane-api",
    demoUrl: "https://arcane-api.example.com",
    imageUrl: "/images/projects/api.jpg",
    caseStudy: `
# Arcane API

## Overview
Arcane API is a RESTful API service with comprehensive documentation and robust authentication. It serves as the backbone for multiple client applications, providing consistent data access and business logic.

## Challenge
The client needed a centralized API that could serve multiple frontend applications while maintaining consistent business logic, security, and performance.

## Solution
I designed and implemented a RESTful API that features:

- Comprehensive endpoint documentation with Swagger
- JWT-based authentication and role-based access control
- Rate limiting and request throttling for security
- Caching strategies for improved performance
- Versioning system for backward compatibility

## Technologies Used
- Node.js and Express for the API framework
- JWT for authentication
- MongoDB for data storage
- Redis for caching
- Docker for containerization

## Results
The API now serves as the foundation for 5 different client applications, reducing development time for new features by 50% and ensuring consistent business logic across all platforms.

![API Documentation](/images/projects/api-docs.jpg)
    `,
    featured: 0,
    createdAt: new Date(),
  },
  {
    id: 5,
    title: "Divination Blog",
    slug: "divination-blog",
    company: "Mystic Web Solutions",
    date: new Date("2022-06-15"),
    description: "A content management system with markdown support and SEO optimization.",
    githubUrl: "https://github.com/example/divination-blog",
    demoUrl: "https://divination-blog.example.com",
    imageUrl: "/images/projects/blog.jpg",
    caseStudy: `
# Divination Blog

## Overview
Divination Blog is a content management system with markdown support and SEO optimization. It provides an intuitive interface for content creators while ensuring optimal search engine visibility.

## Challenge
The client needed a blogging platform that would be easy to use for non-technical content creators while also being optimized for search engines to maximize organic traffic.

## Solution
I developed a custom CMS that includes:

- Intuitive markdown editor with live preview
- Automated SEO optimization suggestions
- Social media integration for content sharing
- Content scheduling and publishing workflow
- Analytics dashboard for content performance

## Technologies Used
- Gatsby for static site generation
- GraphQL for data querying
- Netlify CMS for content management
- React for the frontend interface
- Google Analytics for performance tracking

## Results
The blog saw a 75% increase in organic search traffic within three months of launch, and content creation time was reduced by 40% due to the intuitive editing interface.

![Blog Editor](/images/projects/blog-editor.jpg)
    `,
    featured: 0,
    createdAt: new Date(),
  },
  {
    id: 6,
    title: "Crystal Compiler",
    slug: "crystal-compiler",
    company: "Enchanted Systems Inc.",
    date: new Date("2022-04-10"),
    description: "A custom language compiler that translates magical incantations into executable code.",
    githubUrl: "https://github.com/example/crystal-compiler",
    demoUrl: "https://crystal-compiler.example.com",
    imageUrl: "/images/projects/compiler.jpg",
    caseStudy: `
# Crystal Compiler

## Overview
Crystal Compiler is a custom language compiler that translates magical incantations (a domain-specific language) into executable code. It allows domain experts to write code in familiar terminology that gets compiled to efficient runtime code.

## Challenge
The client had domain experts who needed to express complex business logic but weren't familiar with traditional programming languages. They needed a way to write in domain-specific terminology while still producing efficient executable code.

## Solution
I created a custom language compiler that:

- Parses domain-specific syntax into an abstract syntax tree
- Performs optimization passes on the parsed code
- Generates JavaScript or WebAssembly output
- Provides helpful error messages in domain terminology
- Includes a development environment with syntax highlighting

## Technologies Used
- TypeScript for the compiler implementation
- ANTLR for lexing and parsing
- WebAssembly for runtime performance
- Node.js for the CLI tooling
- Monaco Editor for the web IDE

## Results
Domain experts are now able to write and maintain business logic directly, reducing development time by 65% and decreasing the number of logic errors by 40%.

![Compiler IDE](/images/projects/compiler-ide.jpg)
    `,
    featured: 0,
    createdAt: new Date(),
  },
]

// Many-to-many relationship data
export const projectsToSkillsData = [
  // Enchanted E-Commerce
  { projectId: 1, skillId: 1 }, // React
  { projectId: 1, skillId: 2 }, // TypeScript
  { projectId: 1, skillId: 3 }, // Next.js
  { projectId: 1, skillId: 4 }, // Tailwind CSS
  { projectId: 1, skillId: 5 }, // Node.js
  { projectId: 1, skillId: 6 }, // Express
  { projectId: 1, skillId: 8 }, // MongoDB

  // Spellbound Dashboard
  { projectId: 2, skillId: 1 }, // React
  { projectId: 2, skillId: 2 }, // TypeScript
  { projectId: 2, skillId: 16 }, // Redux
  { projectId: 2, skillId: 5 }, // Node.js
  { projectId: 2, skillId: 10 }, // AWS

  // Mystic Messenger
  { projectId: 3, skillId: 1 }, // React
  { projectId: 3, skillId: 5 }, // Node.js
  { projectId: 3, skillId: 6 }, // Express
  { projectId: 3, skillId: 8 }, // MongoDB

  // Arcane API
  { projectId: 4, skillId: 5 }, // Node.js
  { projectId: 4, skillId: 6 }, // Express
  { projectId: 4, skillId: 9 }, // PostgreSQL
  { projectId: 4, skillId: 17 }, // Drizzle ORM
  { projectId: 4, skillId: 11 }, // Docker

  // Divination Blog
  { projectId: 5, skillId: 1 }, // React
  { projectId: 5, skillId: 7 }, // GraphQL
  { projectId: 5, skillId: 12 }, // Vercel

  // Crystal Compiler
  { projectId: 6, skillId: 2 }, // TypeScript
  { projectId: 6, skillId: 5 }, // Node.js
  { projectId: 6, skillId: 13 }, // Jest
]

// Helper function to get projects with their skills
export function getProjectsWithSkills(): ProjectWithSkills[] {
  return projectsData.map((project) => {
    const skillIds = projectsToSkillsData
      .filter((relation) => relation.projectId === project.id)
      .map((relation) => relation.skillId)

    const projectSkills = skillsData.filter((skill) => skillIds.includes(skill.id))

    return {
      ...project,
      skills: projectSkills,
    }
  })
}

// Helper function to get skills with their projects
export function getSkillsWithProjects(): SkillWithProjects[] {
  return skillsData.map((skill) => {
    const projectIds = projectsToSkillsData
      .filter((relation) => relation.skillId === skill.id)
      .map((relation) => relation.projectId)

    const skillProjects = projectsData.filter((project) => projectIds.includes(project.id))

    return {
      ...skill,
      projects: skillProjects,
    }
  })
}

// Helper function to get a single project with its skills
export function getProjectBySlug(slug: string): ProjectWithSkills | undefined {
  const project = projectsData.find((p) => p.slug === slug)
  if (!project) return undefined

  const skillIds = projectsToSkillsData
    .filter((relation) => relation.projectId === project.id)
    .map((relation) => relation.skillId)

  const projectSkills = skillsData.filter((skill) => skillIds.includes(skill.id))

  return {
    ...project,
    skills: projectSkills,
  }
}

// Helper function to get featured projects
export function getFeaturedProjects(): ProjectWithSkills[] {
  return getProjectsWithSkills().filter((project) => project.featured === 1)
}

// Helper function to get skills by category
export function getSkillsByCategory(): Record<string, Skill[]> {
  const categories: Record<string, Skill[]> = {}

  skillsData.forEach((skill) => {
    skill.categories.forEach((category) => {
      if (!categories[category]) {
        categories[category] = []
      }
      // Only add skill once per category (avoid duplicates if skill is in multiple categories)
      if (!categories[category]!.some((s) => s.id === skill.id)) {
        categories[category]!.push(skill)
      }
    })
  })

  return categories
}

// Helper function to get skill categories (without icons - to be added in component)
export function getSkillCategoriesData(): Array<{
  name: string
  color: string
  skills: Array<{ name: string; level: number; categories: string[] }>
}> {
  const categories: Array<{
    name: string
    color: string
    skills: Array<{ name: string; level: number; categories: string[] }>
  }> = []
  
  // Get unique categories from skills data (flatten all categories from all skills)
  const uniqueCategories = [...new Set(skillsData.flatMap(skill => skill.categories))]
  
  uniqueCategories.forEach(categoryName => {
    const categorySkills = skillsData
      .filter(skill => skill.categories.includes(categoryName))
      .map(skill => ({
        name: skill.name,
        level: skill.level,
        categories: skill.categories
      }))
    
    if (categorySkills.length > 0) {
      const config = skillCategoryConfig[categoryName]
      if (config) {
        categories.push({
          name: categoryName,
          color: config.color,
          skills: categorySkills
        })
      }
    }
  })
  
  return categories
}
