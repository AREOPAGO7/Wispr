import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

interface CreateSwapModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateSwapModal({ isOpen, onClose }: CreateSwapModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        offering: '',
        seeking: '',
        image: null as File | null,
        video: null as File | null,
        tags: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('swaps.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
            preserveScroll: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
        const file = e.target.files?.[0];
        if (file) {
            setData(type, file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'title' || name === 'description' || name === 'offering' || name === 'seeking') {
            setData(name, value);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Swap</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={data.title}
                            onChange={handleInputChange}
                            placeholder="What are you offering?"
                            required
                        />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={handleInputChange}
                            placeholder="Describe your offer in detail..."
                            required
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="offering">Offering</Label>
                            <Input
                                id="offering"
                                name="offering"
                                value={data.offering}
                                onChange={handleInputChange}
                                placeholder="What you can offer"
                                required
                            />
                            {errors.offering && <p className="text-sm text-red-500">{errors.offering}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="seeking">Seeking</Label>
                            <Input
                                id="seeking"
                                name="seeking"
                                value={data.seeking}
                                onChange={handleInputChange}
                                placeholder="What you're looking for"
                                required
                            />
                            {errors.seeking && <p className="text-sm text-red-500">{errors.seeking}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Image (optional)</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'image')}
                        />
                        {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="video">Video (optional)</Label>
                        <Input
                            id="video"
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleFileChange(e, 'video')}
                        />
                        {errors.video && <p className="text-sm text-red-500">{errors.video}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-2">
                            {['Programming', 'Design', 'Marketing', 'Writing', 'Teaching', 'Other'].map((tag) => (
                                <Button
                                    key={tag}
                                    type="button"
                                    variant={data.tags.includes(tag) ? 'default' : 'outline'}
                                    onClick={() => {
                                        setData('tags', data.tags.includes(tag)
                                            ? data.tags.filter(t => t !== tag)
                                            : [...data.tags, tag]
                                        );
                                    }}
                                >
                                    {tag}
                                </Button>
                            ))}
                        </div>
                        {errors.tags && <p className="text-sm text-red-500">{errors.tags}</p>}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Swap'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 