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
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '/home',
    },
];

export default function Home() {
    const page = usePage<PageProps>();
    const { swaps = { data: [] }, filters = {} } = page.props;

    // Sort swaps for different tabs
    const hotSwaps = [...(swaps.data || [])].sort((a, b) => 
        (b.likes_count + b.reposts_count) - (a.likes_count + a.reposts_count)
    );

    const newSwaps = [...(swaps.data || [])].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const topSwaps = [...(swaps.data || [])].sort((a, b) => 
        b.likes_count - a.likes_count
    );

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
                                />
                            }
                            newContent={
                                <PostList
                                    posts={newSwaps}
                                />
                            }
                            topContent={
                                <PostList
                                    posts={topSwaps}
                                />
                            }
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
