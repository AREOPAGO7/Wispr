import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { router } from "@inertiajs/react"

interface Comment {
    id: number
    content: string
    created_at: string
    user: {
        id: number
        name: string
        avatar: string | null
    }
}

interface CommentListProps {
    comments: Comment[]
    currentUserId?: number
}

export function CommentList({ comments, currentUserId }: CommentListProps) {
    const handleDelete = (commentId: number) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            router.delete(`/comments/${commentId}`)
        }
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                        <AvatarFallback>{comment.user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div className="font-medium">{comment.user.name}</div>
                            <div className="text-xs text-muted-foreground">
                                {new Date(comment.created_at).toLocaleDateString()}
                            </div>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                    {currentUserId === comment.user.id && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDelete(comment.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete comment</span>
                        </Button>
                    )}
                </div>
            ))}
        </div>
    )
} 