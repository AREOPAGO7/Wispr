import type { Deal } from "../types/skill-swap"

export const completedDeals: Deal[] = [
  {
    id: 1,
    partner: {
      name: "DesignPro",
      avatar: "/placeholder.svg?height=40&width=40",
      skill: "UI/UX Designer",
    },
    title: "React Development for Website Redesign",
    description:
      "Helped with React component architecture and state management for a complex web application. Received UI/UX design guidance for my personal project.",
    offering: "React Development",
    seeking: "UI/UX Design",
    image: "/placeholder.svg?height=300&width=600",
    status: "completed",
    startDate: "2023-10-15",
    completionDate: "2023-11-20",
    tags: ["Programming", "Web Development", "Design"],
  },
  {
    id: 2,
    partner: {
      name: "MarketingGuru",
      avatar: "/placeholder.svg?height=40&width=40",
      skill: "Social Media Manager",
    },
    title: "Photography Sessions for Social Media Strategy",
    description:
      "Provided 3 professional photography sessions for product shots. Received comprehensive social media strategy and content calendar in return.",
    offering: "Photography",
    seeking: "Social Media Management",
    image: "/placeholder.svg?height=300&width=600",
    status: "completed",
    startDate: "2023-09-05",
    completionDate: "2023-10-10",
    tags: ["Photography", "Social Media", "Marketing"],
  },
  {
    id: 3,
    partner: {
      name: "WebWizard",
      avatar: "/placeholder.svg?height=40&width=40",
      skill: "Web Developer",
    },
    title: "Cooking Classes for Portfolio Website",
    description:
      "Provided 5 private cooking lessons focusing on Italian cuisine. Received a complete portfolio website with CMS integration.",
    offering: "Cooking Lessons",
    seeking: "Website Development",
    image: null,
    status: "completed",
    startDate: "2023-08-12",
    completionDate: "2023-09-30",
    tags: ["Cooking", "Food", "Web Development"],
  },
]

export const createdDeals: Deal[] = [
  {
    id: 4,
    partner: {
      name: "LanguageLover",
      avatar: "/placeholder.svg?height=40&width=40",
      skill: "Language Teacher",
    },
    title: "Graphic Design for Spanish Lessons",
    description:
      "Creating marketing materials and course visuals in exchange for Spanish language lessons. Currently in progress with weekly sessions.",
    offering: "Graphic Design",
    seeking: "Spanish Lessons",
    image: "/placeholder.svg?height=300&width=600",
    status: "active",
    startDate: "2024-01-10",
    tags: ["Languages", "Education", "Design"],
  },
  {
    id: 5,
    partner: {
      name: "FitnessFanatic",
      avatar: "/placeholder.svg?height=40&width=40",
      skill: "Personal Trainer",
    },
    title: "Accounting Help for Fitness Training",
    description:
      "Providing tax planning and bookkeeping assistance for a small fitness business. Receiving personalized workout plans and nutrition advice.",
    offering: "Accounting",
    seeking: "Fitness Training",
    image: "/placeholder.svg?height=300&width=600",
    status: "active",
    startDate: "2024-02-05",
    tags: ["Fitness", "Health", "Finance"],
  },
  {
    id: 6,
    partner: {
      name: "MusicMaestro",
      avatar: "/placeholder.svg?height=40&width=40",
      skill: "Music Teacher",
    },
    title: "Logo Design for Piano Lessons",
    description:
      "Creating a brand identity package including logo, business cards, and social media templates. Waiting to start piano lessons once completed.",
    offering: "Logo Design",
    seeking: "Piano Lessons",
    image: null,
    status: "pending",
    startDate: "2024-04-01",
    tags: ["Music", "Design", "Education"],
  },
]
