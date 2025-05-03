import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Chat } from "../../../data/mock-chat"
import { formatDistanceToNow } from "date-fns"

interface ChatListProps {
  chats: Chat[]
  selectedChatId: number | null
  onSelectChat: (chatId: number) => void
}

export function ChatList({ chats, selectedChatId, onSelectChat }: ChatListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-2">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent",
              selectedChatId === chat.id && "bg-accent"
            )}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={chat.userAvatar} alt={chat.userName} />
              <AvatarFallback>{chat.userName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium leading-none">{chat.userName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(chat.messages[chat.messages.length - 1].timestamp), { addSuffix: true })}
                </p>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">{chat.lastMessage}</p>
            </div>
            {chat.unreadCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {chat.unreadCount}
              </Badge>
            )}
          </button>
        ))}
      </div>
    </ScrollArea>
  )
} 