import { type Post } from "@/types/skill-swap"

export const mockSwaps: Post[] = [
  {
    id: 1,
    author: {
      name: "Anas",
      avatar: "/avatars/anas.png",
      skill: "React Developer"
    },
    title: "Offering React expertise for UI/UX design help",
    description: "I've been working with React for 5 years and can help with complex state management, performance optimization, and component architecture. Looking for someone who can help me improve my UI/UX design skills.",
    offering: "React Development",
    seeking: "UI/UX Design",
    image: null,
    video: null,
    likes_count: 24,
    dislikes_count: 0,
    comments_count: 13,
    reposts_count: 5,
    timePosted: "5 days ago",
    tags: ["Programming", "Design", "React", "Frontend"]
  },
  {
    id: 2,
    author: { 
      name: "Anas",
      avatar: "/avatars/anas.png",
      skill: "Node.js Developer"
    },
    title: "Node.js backend development for photography lessons",
    description: "I can help with building robust Node.js backends, API development, and database integration. Looking for someone to teach me photography basics and editing techniques.",
    offering: "Node.js Development",
    seeking: "Photography Lessons",
    image: null,
    video: null,
    likes: 19,
    dislikes: 0,
    comments: 8,
    reposts: 2,
    timePosted: "2 days ago",
    tags: ["Backend", "Node.js", "Photography", "Learning"]
  },
  {
    id: 3,
    author: {
      name: "Sarah",
      avatar: "/avatars/sarah.png",
      skill: "UX Researcher"
    },
    title: "UX research methods for Python data analysis",
    description: "I can teach you how to conduct effective user research, create personas, and design user journeys. Looking for help with Python data analysis and visualization.",
    offering: "UX Research",
    seeking: "Python Data Analysis",
    image: "/images/ux-research.jpg",
    video: null,
    likes: 32,
    dislikes: 1,
    comments: 15,
    reposts: 7,
    timePosted: "1 week ago",
    tags: ["UX", "Research", "Python", "DataScience"]
  }
]
