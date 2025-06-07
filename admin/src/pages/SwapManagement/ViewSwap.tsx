import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

interface SwapDetails {
  id: number;
  uid: string;
  title: string;
  description: string;
  offering: string;
  seeking: string;
  status: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  tags: Array<{
    id: number;
    name: string;
  }>;
  comments: Array<{
    id: number;
    content: string;
    created_at: string;
    user: {
      id: number;
      name: string;
    };
  }>;
}

export default function ViewSwap() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [swap, setSwap] = useState<SwapDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSwapDetails();
  }, [uid]);

  const fetchSwapDetails = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      
      const response = await axios.get(`http://localhost:8000/api/admin/swaps/${uid}`, { headers });
      setSwap(response.data);
    } catch (err) {
      console.error('Failed to fetch swap details:', err);
      setError('Failed to load swap details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this swap?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      
      await axios.delete(`http://localhost:8000/api/admin/swaps/${uid}`, { headers });
      navigate('/swaps');
    } catch (err) {
      console.error('Failed to delete swap:', err);
      setError('Failed to delete swap.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          <p className="text-sm text-zinc-500">Loading swap details...</p>
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

  if (!swap) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate('/swaps')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Swaps
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/swaps/${uid}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{swap.title}</CardTitle>
            <Badge>{swap.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-zinc-500">{swap.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Offering</h3>
                <p className="text-zinc-500">{swap.offering}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Seeking</h3>
                <p className="text-zinc-500">{swap.seeking}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Tags</h3>
              <div className="flex gap-2">
                {swap.tags.map(tag => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">User Information</h3>
              <div className="text-sm text-zinc-500">
                <p>Name: {swap.user.name}</p>
                <p>Email: {swap.user.email}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Comments ({swap.comments.length})</h3>
              <div className="space-y-4">
                {swap.comments.map(comment => (
                  <div key={comment.id} className="border-l-2 border-zinc-200 pl-4">
                    <p className="text-sm text-zinc-500">{comment.content}</p>
                    <div className="mt-1 text-xs text-zinc-400">
                      {comment.user.name} • {format(new Date(comment.created_at), 'MMM d, yyyy')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-zinc-400">
              <p>Created: {format(new Date(swap.created_at), 'MMM d, yyyy HH:mm:ss')}</p>
              <p>Last Updated: {format(new Date(swap.updated_at), 'MMM d, yyyy HH:mm:ss')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 