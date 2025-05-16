// import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from "react"
import { FilterTabs } from "../components/skill-swap/filter-tabs"
import { PostList } from "../components/skill-swap/post-list"

interface Swap {
    id: number;
    uid: string;
    title: string;
    description: string;
    offering: string;
    seeking: string;
    image: string | null;
    video: string | null;
    status: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        avatar: string | null;
    };
    tags: Array<{
        id: number;
        name: string;
    }>;
    likes_count: number;
    dislikes_count: number;
    reposts_count: number;
    saves_count: number;
    interactions: Array<{
        liked: boolean;
        disliked: boolean;
        reposted: boolean;
        saved: boolean;
    }>;
    isLiked?: boolean;
    isDisliked?: boolean;
    isReposted?: boolean;
    isSaved?: boolean;
    comments: Array<{
        id: number;
        content: string;
        user: {
            id: number;
            name: string;
            avatar: string | null;
        };
        created_at: string;
    }>;
}

interface PageProps {
    [key: string]: any;
    swaps?: {
        data: Swap[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters?: {
        search?: string;
        tag?: string;
    };
    auth?: {
        user: {
            id: number;
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '/home',
    },
];

export default function Home() {
    const page = usePage<PageProps>();
    const { swaps = { data: [] }, filters = {}, auth } = page.props;
    
    const [likedPosts, setLikedPosts] = useState<number[]>([])
    const [dislikedPosts, setDislikedPosts] = useState<number[]>([])
    const [repostedPosts, setRepostedPosts] = useState<number[]>([])
    const [savedPosts, setSavedPosts] = useState<number[]>([])

    // Filter out user's own swaps and add required properties
    const filteredSwaps = swaps.data
        .filter(swap => swap.user.id !== auth?.user?.id)
        .map(swap => ({
            ...swap,
            isLiked: swap.interactions?.[0]?.liked || false,
            isDisliked: swap.interactions?.[0]?.disliked || false,
            isReposted: swap.interactions?.[0]?.reposted || false,
            isSaved: swap.interactions?.[0]?.saved || false,
            comments: swap.comments || []
        }));

    const handleLike = async (swapId: number) => {
        try {
            const response = await fetch(`/swaps/${swapId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            const data = await response.json();
            if (data.is_liked) {
                setLikedPosts([...likedPosts, swapId]);
            } else {
                setLikedPosts(likedPosts.filter(id => id !== swapId));
            }
        } catch (error) {
            console.error('Error liking swap:', error);
        }
    }

    const handleDislike = async (swapId: number) => {
        try {
            const response = await fetch(`/swaps/${swapId}/dislike`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            const data = await response.json();
            if (data.is_disliked) {
                setDislikedPosts([...dislikedPosts, swapId]);
            } else {
                setDislikedPosts(dislikedPosts.filter(id => id !== swapId));
            }
        } catch (error) {
            console.error('Error disliking swap:', error);
        }
    }

    const handleRepost = async (swapId: number) => {
        try {
            const response = await fetch(`/swaps/${swapId}/repost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            const data = await response.json();
            if (data.is_reposted) {
                setRepostedPosts([...repostedPosts, swapId]);
            } else {
                setRepostedPosts(repostedPosts.filter(id => id !== swapId));
            }
        } catch (error) {
            console.error('Error reposting swap:', error);
        }
    }

    const handleSave = async (swapId: number) => {
        try {
            const response = await fetch(`/swaps/${swapId}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            const data = await response.json();
            if (data.is_saved) {
                setSavedPosts([...savedPosts, swapId]);
            } else {
                setSavedPosts(savedPosts.filter(id => id !== swapId));
            }
        } catch (error) {
            console.error('Error saving swap:', error);
        }
    }

    // Sort swaps for different tabs using filtered swaps
    const hotSwaps = [...filteredSwaps].sort((a, b) => 
        (b.likes_count + b.reposts_count) - (a.likes_count + a.reposts_count)
    );
    const newSwaps = [...filteredSwaps].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const topSwaps = [...filteredSwaps].sort((a, b) => b.likes_count - a.likes_count);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-center">
                    <div className="w-full max-w-5xl mx-auto p-4">
                        <FilterTabs
                            hotContent={
                                <PostList
                                    posts={hotSwaps}
                                    onLike={handleLike}
                                    onDislike={handleDislike}
                                    onRepost={handleRepost}
                                    onSave={handleSave}
                                />
                            }
                            newContent={
                                <PostList
                                    posts={newSwaps}
                                    onLike={handleLike}
                                    onDislike={handleDislike}
                                    onRepost={handleRepost}
                                    onSave={handleSave}
                                />
                            }
                            topContent={
                                <PostList
                                    posts={topSwaps}
                                    onLike={handleLike}
                                    onDislike={handleDislike}
                                    onRepost={handleRepost}
                                    onSave={handleSave}
                                />
                            }
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
