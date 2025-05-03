import type { Post } from "@/types/skill-swap"

export const mockPosts: Post[] = [
  {
    id: 1,
    author: {
      name: "AlexCoder",
      avatar: "/placeholder.svg?height=40&width=40",
      skill: "Full-stack Developer",
    },
    title: "Offering React expertise for UI/UX design help",
    description:
      "I've been working with React for 5 years and can help with complex state management, performance optimization, and component architecture. Looking for someone who can help me improve my UI/UX design skills.",
    offering: "React Development",
    seeking: "UI/UX Design",
    image: "/placeholder.svg?height=300&width=600",
    video: null,
    likes: 128,
    comments: 32,
    reposts: 14,
    timePosted: "3 hours ago",
    tags: ["Programming", "Web Development", "Design"],
  },
  {
    id: 2,
    author: {
      name: "PhotoMaster",
      avatar: "/placeholder.svg?height=40&width=40",
      skill: "Professional Photographer",
    },
    title: "Professional photography sessions for social media management",
    description:
      "I can offer professional photography sessions (portrait, product, or event) in exchange for help with managing my social media accounts and growing my online presence.",
    offering: "Photography",
    seeking: "Social Media Management",
    image: "/placeholder.svg?height=300&width=600",
    video: null,
    likes: 95,
    comments: 21,
    reposts: 8,
    timePosted: "5 hours ago",
    tags: ["Photography", "Social Media", "Marketing"],
  },
  {
    id: 3,
    author: {
      name: "CookingPro",
      avatar: "/placeholder.svg?height=40&width=40",
      skill: "Professional Chef",
    },
    title: "Cooking lessons for website development",
    description:
      "I'm a professional chef with 10 years of experience. I can teach you how to cook amazing meals, bake, or even prepare for a special occasion. Looking for someone who can help me build a simple website for my catering business.",
    offering: "Cooking Lessons",
    seeking: "Website Development",
    image: null,
    video: "cooking-demo.mp4", // This would be a real video path in production
    likes: 210,
    comments: 45,
    reposts: 28,
    timePosted: "1 day ago",
    tags: ["Cooking", "Food", "Web Development"],
  },
  {
    id: 4,
    author: {
      name: "LanguageLover",
      avatar: "/placeholder.svg?height=40&width=40",
      skill: "Language Teacher",
    },
    title: "Spanish lessons for graphic design help",
    description:
      "I'm a certified Spanish teacher offering personalized lessons for all levels. I need help creating graphics and visual materials for my teaching business. Let's swap skills!",
    offering: "Spanish Lessons",
    seeking: "Graphic Design",
    image: "/placeholder.svg?height=300&width=600",
    video: null,
    likes: 87,
    comments: 19,
    reposts: 5,
    timePosted: "2 days ago",
    tags: ["Languages", "Education", "Design"],
  },
  {
    id: 5,
    author: {
      name: "FitnessFanatic",
      avatar: "/placeholder.svg?height=40&width=40",
      skill: "Personal Trainer",
    },
    title: "Personalized fitness training for accounting help",
    description:
      "I can create a personalized fitness plan and provide online coaching to help you reach your fitness goals. In exchange, I need help with accounting and tax planning for my small fitness business.",
    offering: "Fitness Training",
    seeking: "Accounting",
    image: "/placeholder.svg?height=300&width=600",
    video: null,
    likes: 156,
    comments: 34,
    reposts: 12,
    timePosted: "3 days ago",
    tags: ["Fitness", "Health", "Finance"],
  },
]
