import { type Deal } from "@/types/skill-swap"

export const mockDeals: Deal[] = [
  {
    id: 1,
    partner: {
      name: "Sarah Chen",
      avatar: "/avatars/sarah.png",
      skill: "UX Designer"
    },
    title: "React Component Development for UI Design System",
    description: "I'm helping Sarah build a component library while she's creating UI design guidelines for my app.",
    offering: "React Development",
    seeking: "UI/UX Design",
    image: null,
    status: "active",
    startDate: "2025-04-15",
    tags: ["React", "UI Design", "Components"]
  },
  {
    id: 2,
    partner: {
      name: "Michael Rodriguez",
      avatar: "/avatars/michael.png",
      skill: "Photography Instructor"
    },
    title: "Backend API for Photography Portfolio",
    description: "Building a Node.js API for Michael's photography portfolio website in exchange for photography lessons.",
    offering: "Node.js Development",
    seeking: "Photography Lessons",
    image: "/images/photography.jpg",
    status: "active",
    startDate: "2025-05-01",
    tags: ["Node.js", "API", "Photography"]
  },
  {
    id: 3,
    partner: {
      name: "Emma Wilson",
      avatar: "/avatars/emma.png",
      skill: "Content Writer"
    },
    title: "Website Development for Blog Content",
    description: "Created a blog platform for Emma in exchange for content writing for my tech tutorials site.",
    offering: "Web Development",
    seeking: "Content Writing",
    image: null,
    status: "completed",
    startDate: "2025-03-10",
    completionDate: "2025-04-05",
    tags: ["WordPress", "Content", "Blog"]
  },
  {
    id: 4,
    partner: {
      name: "Alex Johnson",
      avatar: "/avatars/alex.png",
      skill: "Data Scientist"
    },
    title: "Frontend Dashboard for Data Visualization",
    description: "Building an interactive dashboard for Alex's data science project in exchange for help with ML algorithms.",
    offering: "Frontend Development",
    seeking: "Machine Learning",
    image: null,
    status: "pending",
    startDate: "2025-05-08",
    tags: ["Dashboard", "Data Viz", "React"]
  }
]

export const activeDeals = mockDeals.filter(deal => deal.status === "active");
export const pendingDeals = mockDeals.filter(deal => deal.status === "pending");
export const completedDeals = mockDeals.filter(deal => deal.status === "completed");
