import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { type PageProps } from '@/types';

type Tag = {
    id: number;
    name: string;
};

interface SwapManageProps extends PageProps {
    swap: {
        id: number;
        uid: string;
        title: string;
        description: string;
        offering: string;
        seeking: string;
        status: 'active' | 'inactive' | 'completed' | 'pending';
        image?: string | null;
        tags: Tag[];
    };
    allTags: Tag[];
}

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'completed', label: 'Completed' },
];

export default function Manage({ auth, swap, allTags }: SwapManageProps) {
    const [selectedTags, setSelectedTags] = useState<number[]>(
        swap.tags.map(tag => tag.id)
    );
    // Generate full URL for the current image if it exists
    const getImageUrl = (path: string | null | undefined) => {
        if (!path) return null;
        return path.startsWith('http') ? path : `/storage/${path}`;
    };

    const [imagePreview, setImagePreview] = useState<string | null>(getImageUrl(swap.image) || null);
    
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: swap.title,
        description: swap.description,
        offering: swap.offering,
        seeking: swap.seeking,
        status: swap.status,
        tags: swap.tags.map(tag => tag.id),
        image: null as File | null,
    });

    const handleTagToggle = (tagId: number) => {
        setSelectedTags(prev => 
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
        setData('tags', 
            data.tags.includes(tagId)
                ? data.tags.filter((id: number) => id !== tagId)
                : [...data.tags, tagId]
        );
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('my-swaps.update', swap.uid), {
            forceFormData: true,
            onSuccess: () => {
                // Handle success (e.g., show toast)
            },
        });
    };

    return (
        <AppLayout user={auth.user}>
            <Head title={`Edit ${swap.title}`} />
            
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-700">
                    <div>
                        <h1 className="text-2xl font-bold">Edit Swap</h1>
                        <p className="text-muted-foreground">
                            Update your swap details below
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route('my-swaps.show', swap.uid)}>Cancel</Link>
                        </Button>
                        <Button onClick={handleSubmit} disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Main Form */}
                        <div className="space-y-6 md:col-span-2">
                            <Card className="border border-zinc-800 dark:border-zinc-800">
                                <CardHeader className="border-b border-zinc-800 dark:border-zinc-800 mb-6">
                                    <CardTitle>Basic Information</CardTitle>
                                    <CardDescription>
                                        Update the basic details of your swap.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <div className='mb-2'></div>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="e.g. Vintage Camera for Vinyl Records"
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-red-500">{errors.title}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <div className='mb-2'></div>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Tell others about what you're offering and what you're looking for..."
                                            rows={5}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-500">{errors.description}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="offering">Offering</Label>
                                            <div className='mb-2'></div>
                                            <Input
                                                id="offering"
                                                value={data.offering}
                                                onChange={(e) => setData('offering', e.target.value)}
                                                placeholder="What you have"
                                            />
                                            {errors.offering && (
                                                <p className="text-sm text-red-500">{errors.offering}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="seeking">Seeking</Label>
                                            <div className='mb-2'></div>
                                            <Input
                                                id="seeking"
                                                value={data.seeking}
                                                onChange={(e) => setData('seeking', e.target.value)}
                                                placeholder="What you want"
                                            />
                                            {errors.seeking && (
                                                <p className="text-sm text-red-500">{errors.seeking}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Tags</CardTitle>
                                    <CardDescription>
                                        Add relevant tags to help others find your swap.
                                    </CardDescription>
                                </CardHeader>
                               
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {allTags.map((tag) => (
                                            <Button
                                                key={tag.id}
                                                type="button"
                                                variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => handleTagToggle(tag.id)}
                                            >
                                                {tag.name}
                                            </Button>
                                        ))}
                                    </div>
                                    {errors.tags && (
                                        <p className="mt-2 text-sm text-red-500">{errors.tags}</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card className="border border-zinc-200 dark:border-zinc-800">
                                <CardHeader>
                                    <CardTitle>Status</CardTitle>
                                    <CardDescription>
                                        Update the status of your swap.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) =>
                                            setData('status', value as 'active' | 'inactive' | 'completed')
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="mt-2 text-sm text-red-500">{errors.status}</p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Image</CardTitle>
                                    <CardDescription>
                                        Add an image to make your swap stand out.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {imagePreview ? (
                                            <div className="relative group">
                                                <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg p-1 hover:border-primary transition-colors duration-200">
                                                    <img
                                                        src={imagePreview}
                                                        alt={swap.title}
                                                        className="w-full h-48 object-cover rounded-md border border-zinc-200 dark:border-zinc-700"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setImagePreview(null);
                                                        setData('image', null);
                                                        const fileInput = document.getElementById('image-upload') as HTMLInputElement;
                                                        if (fileInput) {
                                                            fileInput.value = '';
                                                        }
                                                    }}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center w-full">
                                                <label
                                                    htmlFor="image-upload"
                                                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-200"
                                                >
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <svg
                                                            className="w-10 h-10 mb-3 text-zinc-400"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={1.5}
                                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                        <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                                        </p>
                                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                            PNG, JPG, GIF (MAX. 5MB)
                                                        </p>
                                                    </div>
                                                    <input
                                                        id="image-upload"
                                                        name="image"
                                                        type="file"
                                                        className="hidden"
                                                        onChange={handleImageChange}
                                                        accept="image/*"
                                                    />
                                                </label>
                                            </div>
                                        )}
                                        {errors.image && (
                                            <p className="text-sm text-red-500">{errors.image}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="">
                                <CardHeader>
                                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium mb-2">Delete this swap</h4>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                Once you delete a swap, there is no going back. Please be certain.
                                            </p>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                className="w-full text-white/80"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this swap? This action cannot be undone.')) {
        router.delete(route('my-swaps.destroy', swap.uid));
                                                    }
                                                }}
                                            >
                                                Delete Swap
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
