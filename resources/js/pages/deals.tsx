import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal, Calendar, CheckCircle, MessageSquare, Handshake, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { usePage } from '@inertiajs/react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface PageProps {
  auth: {
    user: User;
  };
  [key: string]: any;
}

interface Deal {
  id: number;
  status: 'pending' | 'in_progress' | 'completed' | 'reported';
  swap: {
    id: number;
    title: string;
    description: string;
    offering: string;
    seeking: string;
    tags: Array<{
      id: number;
      name: string;
      created_at: string;
      updated_at: string;
      pivot: {
        swap_id: number;
        tag_id: number;
      };
    }>;
    created_at: string;
  };
  initiator: {
    id: number;
    name: string;
    avatar: string | null;
  };
  acceptor: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

interface DealsProps {
  deals: Deal[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'My Deals',
    href: '/deals',
  },
];

export default function Deals({ deals }: DealsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [sortBy, setSortBy] = useState('Newest First');

  // Filter deals based on search query and status
  const filteredDeals = deals.filter(deal => {
    const matchesSearch = searchQuery === '' || 
      deal.swap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.swap.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All Statuses' || 
      deal.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort deals based on selection
  const sortedDeals = [...filteredDeals].sort((a, b) => {
    if (sortBy === 'Newest First') {
      return new Date(b.swap.created_at).getTime() - new Date(a.swap.created_at).getTime();
    } else if (sortBy === 'Oldest First') {
      return new Date(a.swap.created_at).getTime() - new Date(b.swap.created_at).getTime();
    }
    return 0;
  });

  // Group deals by status
  const activeDeals = deals.filter(deal => deal.status === 'in_progress');
  const pendingDeals = deals.filter(deal => deal.status === 'pending');
  const completedDeals = deals.filter(deal => deal.status === 'completed');

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="My Deals" />
      <div className="flex h-full">
        {/* Main content */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">My Deals</h2>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-background border mb-6">
              <TabsTrigger value="all">All Deals</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            {/* All deals tab */}
            <TabsContent value="all" className="space-y-6">
              {sortedDeals.length > 0 ? (
                sortedDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-10">No deals found</p>
              )}
            </TabsContent>

            {/* Active deals tab */}
            <TabsContent value="active" className="space-y-6">
              {activeDeals.length > 0 ? (
                activeDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-10">No active deals</p>
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-6">
              {pendingDeals.length > 0 ? (
                pendingDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-10">No pending deals</p>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              {completedDeals.length > 0 ? (
                completedDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-10">No completed deals</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}

interface DealCardProps {
  deal: Deal;
}

function DealCard({ deal }: DealCardProps) {
  const { auth } = usePage<PageProps>().props;
  const isInitiator = deal.initiator.id === auth.user.id;
  const partner = isInitiator ? deal.acceptor : deal.initiator;

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800";
      case "reported":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={partner.avatar || "/placeholder.svg"} alt={partner.name} />
              <AvatarFallback>{partner.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{partner.name}</p>
              <p className="text-xs text-muted-foreground">
                {isInitiator ? 'You initiated this deal' : 'You received this deal'}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(deal.status)}>
            {deal.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Badge>
        </div>

        <h3 className="text-lg font-semibold mb-2">{deal.swap.title}</h3>
        
        <div className="flex gap-2 mb-3">
          <Badge variant="outline" className="bg-white/10 text-white">
            Offering: {deal.swap.offering}
          </Badge>
          <Badge variant="outline">
            Seeking: {deal.swap.seeking}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">{deal.swap.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {deal.swap.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Started: {formatDate(deal.swap.created_at)}</span>
          </div>
          
          <div className="ml-auto flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-1"
              onClick={() => router.visit(`/deals/${deal.id}`)}
            >
              <MessageSquare className="h-4 w-4" />
              View Details
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {deal.status === "in_progress" && (
                  <DropdownMenuItem onClick={() => router.post(route('deals.complete', deal.id))}>
                    Mark as Completed
                  </DropdownMenuItem>
                )}
                {deal.status === "pending" && isInitiator && (
                  <DropdownMenuItem onClick={() => router.post(route('deals.reject', deal.id))}>
                    Cancel Deal
                  </DropdownMenuItem>
                )}
                {deal.status === "completed" && (
                  <DropdownMenuItem onClick={() => router.visit(`/deals/${deal.id}`)}>
                    Leave Feedback
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}