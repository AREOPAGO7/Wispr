export interface Message {
  id: number;
  senderId: number;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'deal';
  file?: {
    name: string;
    size: string;
    type: string;
  };
  deal?: {
    id: number;
    title: string;
    status: 'pending' | 'accepted' | 'rejected';
  };
}

export interface Chat {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  unreadCount: number;
  messages: Message[];
}

export const mockChats: Chat[] = [
  {
    id: 1,
    userId: 2,
    userName: "John Doe",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "I'll send you the files shortly",
    unreadCount: 2,
    messages: [
      {
        id: 1,
        senderId: 2,
        content: "Hi! I'm interested in your web development skills",
        timestamp: "2024-05-02T10:00:00",
        type: "text"
      },
      {
        id: 2,
        senderId: 1,
        content: "Great! What kind of project do you have in mind?",
        timestamp: "2024-05-02T10:05:00",
        type: "text"
      },
      {
        id: 3,
        senderId: 2,
        content: "I need a portfolio website",
        timestamp: "2024-05-02T10:10:00",
        type: "text"
      },
      {
        id: 4,
        senderId: 2,
        content: "Here's my current design",
        timestamp: "2024-05-02T10:15:00",
        type: "file",
        file: {
          name: "portfolio-design.pdf",
          size: "2.5 MB",
          type: "application/pdf"
        }
      },
      {
        id: 5,
        senderId: 1,
        content: "I can help with that! Let's create a deal",
        timestamp: "2024-05-02T10:20:00",
        type: "deal",
        deal: {
          id: 1,
          title: "Portfolio Website Development",
          status: "pending"
        }
      }
    ]
  },
  {
    id: 2,
    userId: 3,
    userName: "Jane Smith",
    userAvatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "The deal looks good to me",
    unreadCount: 0,
    messages: [
      {
        id: 1,
        senderId: 3,
        content: "I can help you with your design skills",
        timestamp: "2024-05-02T09:00:00",
        type: "text"
      },
      {
        id: 2,
        senderId: 1,
        content: "That would be great! What's your rate?",
        timestamp: "2024-05-02T09:05:00",
        type: "text"
      },
      {
        id: 3,
        senderId: 3,
        content: "Let's discuss the details",
        timestamp: "2024-05-02T09:10:00",
        type: "text"
      }
    ]
  }
]; 