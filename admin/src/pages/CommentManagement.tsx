import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit, Trash2, Eye, Loader2, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Swap {
  id: number;
  uid: string;
  title: string;
  description: string;
  status: string;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: User;
  swap: Swap;
}

interface PaginatedResponse {
  data: Comment[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

const CommentManagement: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchComments();
  }, [currentPage]);

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      
      const response = await axios.get<PaginatedResponse>(
        `http://localhost:8000/api/admin/comments?page=${currentPage}`, 
        { headers }
      );
      
      setComments(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      setError('Failed to load comments.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };
        await axios.delete(`http://localhost:8000/api/admin/comments/${commentId}`, { headers });
        fetchComments(); // Refresh the list after deletion
      } catch (err) {
        console.error('Failed to delete comment:', err);
        setError('Failed to delete comment.');
      }
    }
  };

  // Group comments by swap
  const commentsBySwap = comments.reduce((acc, comment) => {
    const swapId = comment.swap.id;
    if (!acc[swapId]) {
      acc[swapId] = {
        swap: comment.swap,
        comments: []
      };
    }
    acc[swapId].comments.push(comment);
    return acc;
  }, {} as Record<number, { swap: Swap; comments: Comment[] }>);

  if (loading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          <p className="text-sm text-zinc-500">Loading comments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200/30 bg-red-500/5 p-6">
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <span className="text-red-500 text-xl">!</span>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-red-500">Error</h3>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Comment Management</h1>
        <p className="text-zinc-500">Manage and monitor all comments in the system.</p>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950"
          />
        </div>
      </div>

      {Object.entries(commentsBySwap).length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-[450px] items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-center">
              <Search className="h-8 w-8 text-zinc-400" />
              <p className="font-medium">No comments found</p>
              <p className="text-sm text-zinc-500">Comments will appear here when users make them</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(commentsBySwap).map(([swapId, { swap, comments }]) => (
            <Card key={swapId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {swap.title}
                    <span className="ml-2 text-sm text-zinc-500">({comments.length} comments)</span>
                  </CardTitle>
                  <Badge>{swap.status}</Badge>
                </div>
                <p className="text-sm text-zinc-500 line-clamp-2">{swap.description}</p>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {comments.map((comment) => (
                    <div key={comment.id} className="py-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.user.name}</span>
                          <span className="text-sm text-zinc-500">{comment.user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-zinc-500">
                            {format(new Date(comment.created_at), 'MMM d, yyyy HH:mm')}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteComment(comment.id)}
                              className="h-8 w-8 text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className="text-zinc-700 dark:text-zinc-300">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentManagement;