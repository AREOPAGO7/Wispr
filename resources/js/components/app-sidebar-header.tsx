import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType, type User } from '@/types';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CreateSwapModal } from './skill-swap/create-swap-modal';
import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import debounce from 'lodash/debounce';

//navbar 

interface Filters {
    search?: string;
    tag?: string;
}

interface PageProps {
    filters?: Filters;
    [key: string]: any;
}

interface AppSidebarHeaderProps {
    breadcrumbs?: BreadcrumbItemType[];
    user?: User;
    [key: string]: any;
}

export function AppSidebarHeader({ breadcrumbs = [], user, ...props }: AppSidebarHeaderProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const page = usePage<PageProps>();
    const [searchValue, setSearchValue] = useState('');
    
    // Initialize search value from URL params
    useEffect(() => {
        if (page.props.filters?.search) {
            setSearchValue(page.props.filters.search);
        }
    }, [page.props.filters?.search]);
    
    const handleSearch = debounce((search: string) => {
        router.get(route('home'), { search: search || undefined }, {
            preserveState: true,
            replace: true,
            only: ['swaps', 'filters']
        });
    }, 300);

    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 sticky top-0 z-50 bg-background items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2 flex-1">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-2">
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Seek Swaps ..."
                        className="pl-8"
                        value={searchValue}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearchValue(value);
                            handleSearch(value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch(searchValue);
                            }
                        }}
                    />
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Swap
                </Button>
            </div>

            <CreateSwapModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />
        </header>
    );
}
