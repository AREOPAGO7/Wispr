import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { type PageProps } from '@/types';

interface SwapShowProps extends PageProps {
    swap: {
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
        tags: Array<{ id: number; name: string }>;
        user: {
            id: number;
            name: string;
            avatar?: string | null;
        };
        comments: Array<{
            id: number;
            content: string;
            created_at: string;
            user: {
                id: number;
                name: string;
                avatar?: string | null;
            };
        }>;
    };
    engagement: {
        total_views: number;
        total_likes: number;
        total_comments: number;
        total_deals: number;
    };
}

const statusVariant = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-zinc-100 text-zinc-800',
    completed: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
} as const;

export default function Show({ auth, swap, engagement }: SwapShowProps) {
    return (
        <AppLayout user={auth.user}>
            <Head title={swap.title} />
            
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1 ">
                        <div className="flex items-center justify-between mb-6 border border-zinc-800 rounded-lg p-6 ">
                            <div>
                                <h1 className="text-3xl font-bold ">{swap.title}</h1>
                                <div className="flex items-center mt-2 text-sm text-zinc-500">
                                    <span>Posted by {swap.user.name}</span>
                                    <span className="mx-2">•</span>
                                    <span>{formatDistanceToNow(new Date(swap.created_at))} ago</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" asChild>
                                    <Link href={route('my-swaps.edit', swap.uid)}>Edit</Link>
                                </Button>
                                <Badge className={statusVariant[swap.status]}>
                                    {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                                </Badge>
                            </div>
                        </div>

                        <Card className="mb-6 border border-zinc-800 rounded-lg">
                            <CardHeader>
                                <CardTitle>Swap Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-zinc-500">Offering</h3>
                                    <p className="mt-1">{swap.offering}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-zinc-500">Seeking</h3>
                                    <p className="mt-1">{swap.seeking}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-zinc-500">Description</h3>
                                    <p className="mt-1 whitespace-pre-line">{swap.description}</p>
                                </div>
                                {swap.tags.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-zinc-500 mb-2">Tags</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {swap.tags.map((tag) => (
                                                <Badge key={tag.id} variant="secondary">
                                                    {tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Comments Section */}
                        <Card className="border border-zinc-800 rounded-lg">
                            <CardHeader>
                                <CardTitle>Comments ({swap.comments.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {swap.comments.length > 0 ? (
                                    <div className="space-y-4">
                                        {swap.comments.map((comment) => (
                                            <div key={comment.id} className="flex gap-3">
                                                <Avatar>
                                                    <AvatarImage src={comment.user.avatar || undefined} />
                                                    <AvatarFallback>
                                                        {comment.user.name.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{comment.user.name}</span>
                                                        <span className="text-xs text-zinc-500">
                                                            {formatDistanceToNow(new Date(comment.created_at))} ago
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-sm">{comment.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-zinc-500 text-center py-4">No comments yet.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="md:w-80 space-y-6">
                        {/* Engagement Stats */}
                        <Card className="border-zinc-700">
                            <CardHeader>
                                <CardTitle>Engagement</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-zinc-900 rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-colors">
                                        <div className="text-2xl font-bold text-white">{engagement.total_views || 0}</div>
                                        <div className="text-sm text-zinc-400">Views</div>
                                    </div>
                                    <div className="text-center p-4 bg-zinc-900 rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-colors">
                                        <div className="text-2xl font-bold text-white">{engagement.total_likes || 0}</div>
                                        <div className="text-sm text-zinc-400">Likes</div>
                                    </div>
                                    <div className="text-center p-4 bg-zinc-900 rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-colors">
                                        <div className="text-2xl font-bold text-white">{engagement.total_comments || 0}</div>
                                        <div className="text-sm text-zinc-400">Comments</div>
                                    </div>
                                    <div className="text-center p-4 bg-zinc-900 rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-colors">
                                        <div className="text-2xl font-bold text-white">{engagement.total_deals || 0}</div>
                                        <div className="text-sm text-zinc-400">Deals</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card className="border border-zinc-800 rounded-lg">
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button 
                                    className="w-full" 
                                    variant="outline"
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        // You might want to add a toast notification here
                                        alert('Link copied to clipboard!');
                                    }}
                                >
                                    Share
                                </Button>
                               
                                <Button 
                                    className="w-full text-white" 
                                    variant="destructive"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this swap? This action cannot be undone.')) {
                                            router.delete(route('my-swaps.destroy', swap.uid));
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
