"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PostAuthor } from "./post-author"
import { PostMedia } from "./post-media"
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
    uid: string;
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
    dislikes: number;
    reposts: number;
    saves: number;
    timePosted: string;
    isLiked: boolean;
    isDisliked: boolean;
    isReposted: boolean;
    isSaved: boolean;
    onLike: () => void;
    onDislike: () => void;
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
    uid,
    title,
    description,
    offering,
    seeking,
    image,
    video,
    author,
    tags,
    likes,
    dislikes,
    reposts,
    saves,
    timePosted,
    isLiked,
    isDisliked,
    isReposted,
    isSaved,
    onLike,
    onDislike,
    onRepost,
    onSave,
    comments = [],
}: PostCardProps) {
    const { auth } = usePage().props as unknown as { auth: { user: { id: number } | null } | undefined }
    const [showComments, setShowComments] = useState(false)
    const [showNewComment, setShowNewComment] = useState(false)
    const [localComments, setLocalComments] = useState(comments)
    const [localLikes, setLocalLikes] = useState(likes)
    const [localDislikes, setLocalDislikes] = useState(dislikes)
    const [localReposts, setLocalReposts] = useState(reposts)
    const [localIsLiked, setLocalIsLiked] = useState(isLiked)
    const [localIsDisliked, setLocalIsDisliked] = useState(isDisliked)
    const [localIsReposted, setLocalIsReposted] = useState(isReposted)

    useEffect(() => {
        setLocalComments(comments)
        setLocalLikes(likes)
        setLocalDislikes(dislikes)
        setLocalReposts(reposts)
        setLocalIsLiked(isLiked)
        setLocalIsDisliked(isDisliked)
        setLocalIsReposted(isReposted)
    }, [comments, likes, dislikes, reposts, isLiked, isDisliked, isReposted])

    const handleLike = () => {
        router.post(`/swaps/${uid}/like`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setLocalIsLiked(!localIsLiked)
                if (localIsDisliked) {
                    setLocalIsDisliked(false)
                    setLocalDislikes(prev => prev - 1)
                }
                onLike()
            },
        });
    };

    const handleDislike = () => {
        router.post(`/swaps/${uid}/dislike`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setLocalIsDisliked(!localIsDisliked)
                if (localIsLiked) {
                    setLocalIsLiked(false)
                    setLocalLikes(prev => prev - 1)
                }
                onDislike()
            },
        });
    };

    const handleRepost = () => {
        router.post(`/swaps/${uid}/repost`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setLocalIsReposted(!localIsReposted)
                onRepost()
            },
        });
    };

    const handleSave = () => {
        router.post(`/swaps/${uid}/save`, {}, {
            preserveScroll: true,
            onSuccess: () => onSave(),
        });
    };

    const handleCommentClick = () => {
        setShowComments(!showComments)
    }

    const handleCommentAdded = (newComment: any) => {
        setLocalComments(prev => [...prev, {
            id: newComment.id,
            content: newComment.content,
            created_at: newComment.created_at,
            user: {
                id: newComment.user.id,
                name: newComment.user.name,
                avatar: newComment.user.avatar
            }
        }])
        setShowNewComment(false)
    }

    return (
        <>
            <Card className="overflow-hidden border-2 hover:border-primary/20 transition-all duration-200 max-w-3xl">
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
                                <DropdownMenuItem onClick={handleSave}>{isSaved ? "Unsave" : "Save"} post</DropdownMenuItem>
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
                        likes={localLikes}
                        dislikes={localDislikes}
                        comments={localComments.length}
                        reposts={localReposts}
                        isLiked={localIsLiked}
                        isDisliked={localIsDisliked}
                        isReposted={localIsReposted}
                        onLike={handleLike}
                        onDislike={handleDislike}
                        onRepost={handleRepost}
                        onCommentClick={handleCommentClick}
                    />
                </CardFooter>

                {showComments && (
                    <div className="border-t">
                        <div className="max-h-[300px] overflow-y-auto p-4 space-y-4">
                            {localComments.length > 0 ? (
                                <CommentList comments={localComments} currentUserId={auth?.user?.id} swapId={id} />
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