import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock } from "lucide-react"

interface PostAuthorProps {
  author: {
    name: string
    avatar: string | null
  }
  timePosted: string
}

export function PostAuthor({ author, timePosted }: PostAuthorProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
        <AvatarFallback>{author.name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">{author.name}</div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {(() => {
            const date = new Date(timePosted);
            const now = new Date();
            const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
            
            if (diffInSeconds < 60) {
              return 'just now';
            } else if (diffInSeconds < 3600) {
              const minutes = Math.floor(diffInSeconds / 60);
              return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
            } else if (diffInSeconds < 86400) {
              const hours = Math.floor(diffInSeconds / 3600);
              return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
            } else if (diffInSeconds < 604800) {
              const days = Math.floor(diffInSeconds / 86400);
              return `${days} ${days === 1 ? 'day' : 'days'} ago`;
            } else if (diffInSeconds < 2592000) {
              const weeks = Math.floor(diffInSeconds / 604800);
              return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
            } else {
              return date.toLocaleDateString();
            }
          })()}
        </div>
      </div>
    </div>
  )
}
