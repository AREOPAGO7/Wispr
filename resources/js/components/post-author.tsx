import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock } from "lucide-react"
import type { Author } from "@/types/skill-swap"

interface PostAuthorProps {
  author: Author
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
          {timePosted}
        </div>
      </div>
    </div>
  )
}
