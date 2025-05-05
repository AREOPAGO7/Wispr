import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { router } from "@inertiajs/react"
import { route } from "ziggy-js"

interface CommentFormProps {
    swapId: number
    onCommentAdded?: (comment: any) => void
}

export function CommentForm({ swapId, onCommentAdded }: CommentFormProps) {
    const [content, setContent] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        router.post(route('swaps.comments.store', { swap: swapId }), { content }, {
            preserveScroll: true,
            onSuccess: (response) => {
                setContent("")
                if (onCommentAdded && response.props.comment) {
                    onCommentAdded(response.props.comment)
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