import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus, ArrowUpDown, MoreHorizontal, Heart, MessageSquare, Repeat2, Bookmark, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';

interface Swap {
    id: number;
    uid: string;
    title: string;
    description: string;
    offering: string;
    seeking: string;
    status: 'active' | 'inactive' | 'completed' | 'pending';
    created_at: string;
    updated_at: string;
    image?: string | null;
    tags: Array<{
        id: number;
        name: string;
    }>;
    deals_count?: number;
    likes_count: number;
    comments_count: number;
    reposts_count?: number;
    user?: {
        id: number;
        name: string;
        avatar?: string | null;
    };
}

interface StatsType {
    total_swaps: number;
    active_swaps: number;
    completed_deals: number;
    total_likes: number;
}

interface PageProps extends InertiaPageProps {
    [key: string]: any;
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    swaps: {
        data: Swap[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: StatsType;
    filters: {
        search?: string;
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/home' },
    { title: 'My Swaps', href: '/my-swaps' },
];

const statusVariant = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    completed: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
};

export default function MySwaps() {
    const { auth, swaps, stats, filters } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsSearching(true);
            router.get(
                '/my-swaps',
                { 
                    search: search.trim(), 
                    status: statusFilter === 'all' ? '' : statusFilter 
                },
                { 
                    preserveState: true, 
                    replace: true,
                    onFinish: () => setIsSearching(false)
                }
            );
        }, 500);

        return () => clearTimeout(timer);
    }, [search, statusFilter]);

    const handleStatusChange = (status: string) => {
        setStatusFilter(status);
    };

    const getStatusBadge = (status: string) => {
        const variant = statusVariant[status as keyof typeof statusVariant] || 'bg-gray-100 text-gray-800';
        return (
            <Badge className={`${variant} capitalize`}>
                {status.replace('_', ' ')}
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Swaps" />
            <div className="container mx-auto p-4 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">My Swaps</h1>
                        <p className="text-muted-foreground">Manage your skill swaps and track your activity</p>
                    </div>
                   
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        title="Total Swaps" 
                        value={stats.total_swaps} 
                        icon={<Bookmark className="h-4 w-4 text-muted-foreground" />}
                        description="All your swaps"
                    />
                    <StatCard 
                        title="Active Swaps" 
                        value={stats.active_swaps} 
                        icon={<CheckCircle className="h-4 w-4 text-green-500" />}
                        description="Currently active"
                    />
                    <StatCard 
                        title="Completed Deals" 
                        value={stats.completed_deals} 
                        icon={<CheckCircle className="h-4 w-4 text-blue-500" />}
                        description="Successful exchanges"
                    />
                    <StatCard 
                        title="Total Likes" 
                        value={stats.total_likes} 
                        icon={<Heart className="h-4 w-4 text-pink-500" />}
                        description="Likes received"
                    />
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by title, description, or tags..."
                            className="w-full pl-10 pr-4"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {isSearching && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <Button
                            variant={statusFilter === 'all' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange('all')}
                            size="sm"
                        >
                            All
                        </Button>
                        <Button
                            variant={statusFilter === 'active' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange('active')}
                            size="sm"
                        >
                            Active
                        </Button>
                        <Button
                            variant={statusFilter === 'pending' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange('pending')}
                            size="sm"
                        >
                            Pending
                        </Button>
                        <Button
                            variant={statusFilter === 'completed' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange('completed')}
                            size="sm"
                        >
                            Completed
                        </Button>
                    </div>
                </div>

                {/* Swaps List */}
                <div className="space-y-4">
                    {swaps.data.length > 0 ? (
                        swaps.data.map((swap) => (
                            <SwapCard key={swap.id} swap={swap} />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="rounded-full bg-muted p-4">
                                <Bookmark className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="mt-4 text-lg font-medium">No swaps found</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {search || statusFilter !== 'all' 
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'Get started by creating a new swap.'}
                            </p>
                            <Button asChild>
                                <Link href="/swaps/create">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Swap
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {swaps.last_page > 1 && (
                    <div className="flex justify-center mt-6">
                        <div className="flex gap-2">
                            {Array.from({ length: swaps.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={swaps.current_page === page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => {
                                        router.get(
                                            '/my-swaps',
                                            { page, search, status: statusFilter },
                                            { preserveState: true }
                                        );
                                    }}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value, icon, description }: { title: string; value: number; icon: React.ReactNode; description: string }) {
    return (
        <Card className="hover:shadow-md transition-shadow border border-zinc-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className="h-4 w-4">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

interface SwapCardProps {
    swap: Swap;
}

function SwapCard({ swap }: SwapCardProps) {
    return (
        <Card className="border border-zinc-700 hover:shadow-md transition-shadow">
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{swap.title}</h3>
                            {getStatusBadge(swap.status)}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {swap.description}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {swap.tags?.map((tag: any) => (
                                <Badge key={tag.id} variant="secondary">
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                    </Button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <p className="text-muted-foreground">Offering</p>
                        <p className="font-medium">{swap.offering}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground">Seeking</p>
                        <p className="font-medium">{swap.seeking}</p>
                    </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            <span>{swap.likes_count}</span>
                        </div>
                        <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span>{swap.comments_count || 0}</span>
                        </div>
                        <div className="flex items-center">
                            <Repeat2 className="h-4 w-4 mr-1" />
                            <span>{swap.reposts_count || 0}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(swap.created_at), { addSuffix: true })}
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('my-swaps.show', swap.uid)}>
                                View Details
                            </Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link href={route('my-swaps.edit', swap.uid)}>
                                Manage
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}

function getStatusBadge(status: string) {
    const variant = statusVariant[status as keyof typeof statusVariant] || 'bg-gray-100 text-gray-800';
    return (
        <Badge className={`${variant} capitalize`}>
            {status.replace('_', ' ')}
        </Badge>
    );
}
