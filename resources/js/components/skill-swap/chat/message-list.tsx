import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Download, FileText, Image as ImageIcon } from "lucide-react"

interface Message {
  id: number
  content: string | null
  created_at: string
  user_id: number
  user: {
    id: number
    name: string
    avatar?: string
  }
  attachment_path?: string
  attachment_name?: string
  is_image?: boolean
  mime_type?: string
}

interface MessageListProps {
  messages: Message[]
  currentUserId: number
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="space-y-4 p-4">
        {messages.map((message) => {
          const isCurrentUser = message.user_id === currentUserId
          const hasAttachment = !!message.attachment_path
          
          return (
            <div
              key={message.id}
              className={cn(
                "flex w-full max-w-[80%] flex-col gap-2 rounded-lg p-3 text-sm",
                isCurrentUser
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.user.avatar} alt={message.user.name} />
                  <AvatarFallback>
                    {message.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{message.user.name}</span>
                    <span className="text-xs opacity-70">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  
                  {message.content && (
                    <p className="mt-1">{message.content}</p>
                  )}
                  
                  {hasAttachment && message.attachment_path && message.attachment_name && (
                    <div className="mt-2 rounded-md border bg-background p-2">
                      <div className="flex items-center gap-2">
                        {message.is_image ? (
                          <div className="relative">
                            <img 
                              src={message.attachment_path} 
                              alt={message.attachment_name}
                              className="max-h-40 rounded-md object-cover"
                              onClick={() => window.open(message.attachment_path, '_blank')}
                              style={{ cursor: 'pointer' }}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {getFileIcon(message.mime_type || '')}
                            <span className="max-w-[200px] truncate">{message.attachment_name}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => handleDownload(message.attachment_path!, message.attachment_name!)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
} 