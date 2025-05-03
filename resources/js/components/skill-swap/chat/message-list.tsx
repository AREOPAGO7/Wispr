import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Message } from "../../../data/mock-chat"
import { formatDistanceToNow } from "date-fns"
import { Download, FileText, Handshake } from "lucide-react"

interface MessageListProps {
  messages: Message[]
  currentUserId: number
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="space-y-4 p-4">
        {messages.map((message) => {
          const isCurrentUser = message.senderId === currentUserId
          return (
            <div
              key={message.id}
              className={cn(
                "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                isCurrentUser
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <div className="flex items-center gap-2">
                {message.type === "file" && message.file && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{message.file.name}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {message.type === "deal" && message.deal && (
                  <div className="flex items-center gap-2">
                    <Handshake className="h-4 w-4" />
                    <span>{message.deal.title}</span>
                    <Badge variant="secondary">{message.deal.status}</Badge>
                  </div>
                )}
                {message.type === "text" && <p>{message.content}</p>}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
              </p>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
} 