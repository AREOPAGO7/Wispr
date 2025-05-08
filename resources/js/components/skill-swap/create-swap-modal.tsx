import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Image, Video, Upload } from 'lucide-react';

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

    const [dragActive, setDragActive] = useState(false);

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

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            if (isImage) {
                setData('image', file);
            } else if (isVideo) {
                setData('video', file);
            }
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
                        <div className='mb-1'>
                        <Label htmlFor="title" >Title</Label>
                        </div>
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
                    <div className='mb-1'>
                        <Label htmlFor="description">Description</Label>
                    </div>
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
                        <div className='mb-1'>
                            <Label htmlFor="offering">Offering</Label>
                        </div>
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
                        <div className='mb-1'>
                            <Label htmlFor="seeking">Seeking</Label>
                        </div>
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
                    <div className='mb-2'>
                        <Label>Media (optional)</Label>
                        </div>
                        <div
                            className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                                dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                id="media"
                                accept="image/*,video/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const isImage = file.type.startsWith('image/');
                                        const isVideo = file.type.startsWith('video/');
                                        if (isImage) {
                                            handleFileChange(e, 'image');
                                        } else if (isVideo) {
                                            handleFileChange(e, 'video');
                                        }
                                    }
                                }}
                                className="hidden"
                            />
                            <label
                                htmlFor="media"
                                className="flex flex-col items-center justify-center cursor-pointer"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Image className="w-6 h-6 text-muted-foreground" />
                                    <Video className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <div className="text-sm text-muted-foreground text-center">
                                    <p>Drag and drop your media here, or click to browse</p>
                                    <p className="text-xs mt-1">Supports images and videos</p>
                                </div>
                                {data.image && (
                                    <div className="mt-2 text-sm text-primary">
                                        Image selected: {data.image.name}
                                    </div>
                                )}
                                {data.video && (
                                    <div className="mt-2 text-sm text-primary">
                                        Video selected: {data.video.name}
                                    </div>
                                )}
                            </label>
                        </div>
                        {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                        {errors.video && <p className="text-sm text-red-500">{errors.video}</p>}
                    </div>

                    <div className="space-y-2">
                    <div className='mb-1'>
                        <Label>Tags</Label>
                        </div>
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