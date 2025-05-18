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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import axios from 'axios'

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
    isLiked: initialIsLiked,
    isDisliked: initialIsDisliked,
    isReposted: initialIsReposted,
    isSaved: initialIsSaved,
    comments = [],
}: PostCardProps) {
    const { auth } = usePage().props as unknown as { auth: { user: { id: number } | null } | undefined }
    const [showComments, setShowComments] = useState(false)
    const [showNewComment, setShowNewComment] = useState(false)
    const [localComments, setLocalComments] = useState(comments)
    const [localLikes, setLocalLikes] = useState(likes)
    const [localDislikes, setLocalDislikes] = useState(dislikes)
    const [localReposts, setLocalReposts] = useState(reposts)
    const [localIsLiked, setLocalIsLiked] = useState(initialIsLiked)
    const [localIsDisliked, setLocalIsDisliked] = useState(initialIsDisliked)
    const [localIsReposted, setLocalIsReposted] = useState(initialIsReposted)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setLocalComments(comments)
        setLocalLikes(likes)
        setLocalDislikes(dislikes)
        setLocalReposts(reposts)
        setLocalIsLiked(initialIsLiked)
        setLocalIsDisliked(initialIsDisliked)
        setLocalIsReposted(initialIsReposted)
    }, [comments, likes, dislikes, reposts, initialIsLiked, initialIsDisliked, initialIsReposted])

    const handleLike = async () => {
        setError(null);
        const previousState = {
            isLiked: localIsLiked,
            isDisliked: localIsDisliked,
            likes: localLikes,
            dislikes: localDislikes
        };

        try {
            // Update states first
            setLocalIsLiked(!localIsLiked);
            
            // If we're liking and there's a dislike, remove it
            if (!localIsLiked && localIsDisliked) {
                setLocalIsDisliked(false);
            }

            const response = await axios.post(`/swaps/${uid}/like`, {}, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            // Server returns likes_count and is_liked
            if (response.data) {
                setLocalIsLiked(response.data.is_liked);
                setLocalLikes(response.data.likes_count);
                // If we were disliked before, we know it's removed
                if (localIsDisliked) {
                    setLocalIsDisliked(false);
                    setLocalDislikes(prev => Math.max(0, prev - 1));
                }
            }
        } catch (error) {
            console.error('Error liking swap:', error);
            // Restore previous state on error
            setLocalIsLiked(previousState.isLiked);
            setLocalIsDisliked(previousState.isDisliked);
            setLocalLikes(previousState.likes);
            setLocalDislikes(previousState.dislikes);
            setError('Failed to update like status. Please try again.');
        }
    };

    const handleDislike = async () => {
        setError(null);
        const previousState = {
            isLiked: localIsLiked,
            isDisliked: localIsDisliked,
            likes: localLikes,
            dislikes: localDislikes
        };

        try {
            // Update states first
            setLocalIsDisliked(!localIsDisliked);
            
            // Controller automatically removes like if it exists
            if (localIsLiked) {
                setLocalIsLiked(false);
                setLocalLikes(prev => Math.max(0, prev - 1));
            }

            const response = await axios.post(`/swaps/${uid}/dislike`, {}, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            // Server returns dislikes_count and is_disliked
            if (response.data) {
                setLocalIsDisliked(response.data.is_disliked);
                setLocalDislikes(response.data.dislikes_count);
                // Like is automatically removed by the server
                setLocalIsLiked(false);
            }
        } catch (error) {
            console.error('Error disliking swap:', error);
            // Restore previous state on error
            setLocalIsLiked(previousState.isLiked);
            setLocalIsDisliked(previousState.isDisliked);
            setLocalLikes(previousState.likes);
            setLocalDislikes(previousState.dislikes);
            setError('Failed to update dislike status. Please try again.');
        }
    };

    const handleRepost = () => {
        router.post(`/swaps/${uid}/repost`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setLocalIsReposted(!localIsReposted)
            },
        });
    };

    const handleSave = () => {
        router.post(`/swaps/${uid}/save`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Assuming onSave is called elsewhere in the component
            },
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
                {error && (
                    <Alert variant="destructive" className="mb-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
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
                                <DropdownMenuItem onClick={handleSave}>{initialIsSaved ? "Unsave" : "Save"} post</DropdownMenuItem>
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
                        swap={{
                            id,
                            uid
                        }}
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