"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PostAuthor } from "./post-author"
import { PostMedia } from "@/components/post-media"
import { PostTags } from "./post-tags"
import { SkillBadges } from "./skill-badges"
import { PostActions } from "./post-actions"
import { CommentList } from "./comment-list"
import { CommentForm } from "./comment-form"
import { usePage, router } from "@inertiajs/react"
import { route } from "ziggy-js"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PostCardProps {
    id: number;
    title: string;
    description: string;
    offering: string;
    seeking: string;
    image: string | null;
    video: string | null;
    author: {
        name: string;
        avatar: string | null;
    };
    tags: string[];
    likes: number;
    reposts: number;
    saves: number;
    timePosted: string;
    isLiked: boolean;
    isReposted: boolean;
    isSaved: boolean;
    onLike: () => void;
    onRepost: () => void;
    onSave: () => void;
    comments: Array<{
        id: number;
        content: string;
        created_at: string;
        user: {
            id: number;
            name: string;
            avatar: string | null;
        };
    }>;
}

export function PostCard({
    id,
    title,
    description,
    offering,
    seeking,
    image,
    video,
    author,
    tags,
    likes,
    reposts,
    saves,
    timePosted,
    isLiked,
    isReposted,
    isSaved,
    onLike,
    onRepost,
    onSave,
    comments = [],
}: PostCardProps) {
    const { auth } = usePage().props as unknown as { auth: { user: { id: number } | null } | undefined }
    const [showComments, setShowComments] = useState(false)
    const [showNewComment, setShowNewComment] = useState(false)
    const [localComments, setLocalComments] = useState(comments)

    useEffect(() => {
        setLocalComments(comments)
    }, [comments])

    const handleLike = () => {
        router.post(route('swaps.like', { swap: id }), {}, {
            preserveScroll: true,
            onSuccess: () => onLike(),
        });
    };

    const handleRepost = () => {
        router.post(route('swaps.repost', { swap: id }), {}, {
            preserveScroll: true,
            onSuccess: () => onRepost(),
        });
    };

    const handleCommentClick = () => {
        setShowComments(!showComments)
    }

    const handleCommentAdded = (newComment: any) => {
        setLocalComments(prev => [...prev, newComment])
        setShowNewComment(false)
    }

    return (
        <>
            <Card className="overflow-hidden border-2 hover:border-primary/20 transition-all duration-200">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <PostAuthor author={author} timePosted={timePosted} />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">More options</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={onSave}>{isSaved ? "Unsave" : "Save"} post</DropdownMenuItem>
                                <DropdownMenuItem>Report</DropdownMenuItem>
                                <DropdownMenuItem>Hide</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <CardTitle className="text-lg mt-2">{title}</CardTitle>
                    <SkillBadges offering={offering} seeking={seeking} />
                </CardHeader>

                <CardContent className="pb-2">
                    <CardDescription className="text-sm mb-3">{description}</CardDescription>
                    <PostMedia image={image} video={video} />
                    <PostTags tags={tags} />
                </CardContent>

                <Separator />

                <CardFooter className="py-2 px-6 flex justify-between">
                    <PostActions
                        likes={likes}
                        comments={localComments.length}
                        reposts={reposts}
                        isLiked={isLiked}
                        isReposted={isReposted}
                        onLike={handleLike}
                        onRepost={handleRepost}
                        onCommentClick={handleCommentClick}
                    />
                </CardFooter>

                {showComments && (
                    <div className="border-t">
                        <div className="max-h-[300px] overflow-y-auto p-4 space-y-4">
                            {localComments.length > 0 ? (
                                <CommentList comments={localComments} currentUserId={auth?.user?.id} />
                            ) : (
                                <p className="text-sm text-muted-foreground text-center">No comments yet</p>
                            )}
                        </div>
                        
                        {auth?.user && (
                            <div className="p-4 border-t">
                                <Button 
                                    variant="outline" 
                                    className="w-full" 
                                    onClick={() => setShowNewComment(true)}
                                >
                                    Add a comment
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            <Dialog open={showNewComment} onOpenChange={setShowNewComment}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add a comment</DialogTitle>
                    </DialogHeader>
                    <CommentForm swapId={id} onCommentAdded={handleCommentAdded} />
                </DialogContent>
            </Dialog>
        </>
    )
} 