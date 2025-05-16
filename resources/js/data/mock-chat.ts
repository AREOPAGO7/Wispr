export interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

export interface ChatData {
  dealId: number;
  messages: ChatMessage[];
}

export const mockChats: Record<number, ChatMessage[]> = {
  1: [
    {
      id: 1,
      senderId: 1,
      senderName: "You",
      senderAvatar: "/avatars/user.png",
      content: "Hi Sarah, I'm excited to start working on the React components for your design system!",
      timestamp: "2025-04-15T10:30:00",
      isCurrentUser: true
    },
    {
      id: 2,
      senderId: 2,
      senderName: "Sarah Chen",
      senderAvatar: "/avatars/sarah.png",
      content: "Great to hear from you! I've prepared some initial wireframes for the UI components we discussed.",
      timestamp: "2025-04-15T10:35:00",
      isCurrentUser: false
    },
    {
      id: 3,
      senderId: 1,
      senderName: "You",
      senderAvatar: "/avatars/user.png",
      content: "Perfect! Could you share them so I can start planning the component architecture?",
      timestamp: "2025-04-15T10:38:00",
      isCurrentUser: true
    },
    {
      id: 4,
      senderId: 2,
      senderName: "Sarah Chen",
      senderAvatar: "/avatars/sarah.png",
      content: "Just uploaded them to our shared folder. I've included notes on the interaction patterns and accessibility requirements.",
      timestamp: "2025-04-15T10:45:00",
      isCurrentUser: false
    },
    {
      id: 5,
      senderId: 1,
      senderName: "You",
      senderAvatar: "/avatars/user.png",
      content: "Got them, thanks! I'll review and get back to you with any questions. I'm thinking we should start with the core components like buttons, inputs, and cards.",
      timestamp: "2025-04-15T11:02:00",
      isCurrentUser: true
    }
  ],
  2: [
    {
      id: 1,
      senderId: 1,
      senderName: "You",
      senderAvatar: "/avatars/user.png",
      content: "Hello Michael! I've started working on the backend API for your photography portfolio.",
      timestamp: "2025-05-01T14:20:00",
      isCurrentUser: true
    },
    {
      id: 2,
      senderId: 3,
      senderName: "Michael Rodriguez",
      senderAvatar: "/avatars/michael.png",
      content: "That's great news! When do you think we can have our first photography lesson?",
      timestamp: "2025-05-01T14:30:00",
      isCurrentUser: false
    },
    {
      id: 3,
      senderId: 1,
      senderName: "You",
      senderAvatar: "/avatars/user.png",
      content: "I'm free this weekend if that works for you. I'd like to get the basic API structure set up before then so we can discuss it.",
      timestamp: "2025-05-01T14:35:00",
      isCurrentUser: true
    },
    {
      id: 4,
      senderId: 3,
      senderName: "Michael Rodriguez",
      senderAvatar: "/avatars/michael.png",
      content: "Saturday afternoon works for me. I'll bring my camera equipment and we can go through the basics.",
      timestamp: "2025-05-01T14:40:00",
      isCurrentUser: false
    }
  ],
  3: [
    {
      id: 1,
      senderId: 1,
      senderName: "You",
      senderAvatar: "/avatars/user.png",
      content: "Hi Emma, the blog platform is now complete! You can start adding your content.",
      timestamp: "2025-04-01T09:15:00",
      isCurrentUser: true
    },
    {
      id: 2,
      senderId: 4,
      senderName: "Emma Wilson",
      senderAvatar: "/avatars/emma.png",
      content: "It looks amazing! I've already drafted the first three articles for your tech tutorials site.",
      timestamp: "2025-04-01T09:30:00",
      isCurrentUser: false
    },
    {
      id: 3,
      senderId: 1,
      senderName: "You",
      senderAvatar: "/avatars/user.png",
      content: "Perfect timing! I'll review them this week and provide feedback.",
      timestamp: "2025-04-01T09:35:00",
      isCurrentUser: true
    }
  ],
  4: [
    {
      id: 1,
      senderId: 1,
      senderName: "You",
      senderAvatar: "/avatars/user.png",
      content: "Hey Alex, I'm interested in building the dashboard for your data visualization project.",
      timestamp: "2025-05-08T16:00:00",
      isCurrentUser: true
    },
    {
      id: 2,
      senderId: 5,
      senderName: "Alex Johnson",
      senderAvatar: "/avatars/alex.png",
      content: "That's great! I've been looking for someone with frontend skills. When can we discuss the details?",
      timestamp: "2025-05-08T16:10:00",
      isCurrentUser: false
    },
    {
      id: 3,
      senderId: 1,
      senderName: "You",
      senderAvatar: "/avatars/user.png",
      content: "How about tomorrow at 2pm? I'd like to understand your data structure and visualization needs.",
      timestamp: "2025-05-08T16:15:00",
      isCurrentUser: true
    }
  ]
};
