export interface Author {
    name: string
    avatar: string
    skill: string
  }
  
  export interface Post {
    id: number
    author: Author
    title: string
    description: string
    offering: string
    seeking: string
    image: string | null
    video: string | null
    likes: number
    dislikes: number
    comments: number
    reposts: number
    timePosted: string
    tags: string[]
  }
  export interface Deal {
    id: number
    partner: Author
    title: string
    description: string
    offering: string
    seeking: string
    image: string | null
    status: "pending" | "active" | "completed" | "cancelled"
    startDate: string
    completionDate?: string
    tags: string[]
  }
  
  