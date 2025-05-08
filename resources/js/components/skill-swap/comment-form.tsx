import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { router } from "@inertiajs/react"
import { route } from "ziggy-js"

interface Comment {
    id: number;
    content: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        avatar: string | null;
    };
}

interface CommentFormProps {
    swapId: number;
    onCommentAdded?: (comment: Comment) => void;
}

export function CommentForm({ swapId, onCommentAdded }: CommentFormProps) {
    const [content, setContent] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        router.post(route('swaps.comments.store', { swap: swapId }), { content }, {
            preserveScroll: true,
            onSuccess: (response: any) => {
                setContent("")
                if (onCommentAdded && response.props.comment) {
                    onCommentAdded({
                        id: response.props.comment.id,
                        content: response.props.comment.content,
                        created_at: response.props.comment.created_at,
                        user: {
                            id: response.props.comment.user.id,
                            name: response.props.comment.user.name,
                            avatar: response.props.comment.user.avatar
                        }
                    })
                }
            },
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <Textarea
                placeholder="Write a comment..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[80px]"
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={!content.trim()}>
                    Comment
                </Button>
            </div>
        </form>
    )
} 