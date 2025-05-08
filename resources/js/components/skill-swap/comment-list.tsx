import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { router } from "@inertiajs/react"
import { route } from "ziggy-js"

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
    swapId: number
}

export function CommentList({ comments, currentUserId, swapId }: CommentListProps) {
    const handleDelete = (commentId: number) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            router.delete(route('swaps.comments.destroy', { swap: swapId, comment: commentId }))
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
                                {(() => {
                                    const date = new Date(comment.created_at);
                                    const now = new Date();
                                    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
                                    
                                    if (diffInSeconds < 60) {
                                        return 'just now';
                                    } else if (diffInSeconds < 3600) {
                                        const minutes = Math.floor(diffInSeconds / 60);
                                        return `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`;
                                    } else if (diffInSeconds < 86400) {
                                        const hours = Math.floor(diffInSeconds / 3600);
                                        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
                                    } else if (diffInSeconds < 172800) {
                                        return 'yesterday';
                                    } else {
                                        return date.toLocaleDateString();
                                    }
                                })()}
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