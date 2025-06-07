import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

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
  created_at: string;
  offering: string;
  seeking: string;
}

interface DealDetails {
  id: number;
  swap_id: number;
  initiator_id: number;
  acceptor_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  initiator_rating: number | null;
  acceptor_rating: number | null;
  initiator_rating_score: number | null;
  acceptor_rating_score: number | null;
  report_reason: string | null;
  initiator_accepted: boolean;
  acceptor_accepted: boolean;
  swap: Swap;
  initiator: User;
  acceptor: User;
}

export default function ViewDeal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<DealDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDealDetails();
  }, [id]);

  const fetchDealDetails = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      
      const response = await axios.get<DealDetails>(`http://localhost:8000/api/admin/deals/${id}`, { headers });
      setDeal(response.data);
    } catch (err) {
      console.error('Failed to fetch deal details:', err);
      if (axios.isAxiosError(err)) {
        setError(`Failed to load deal details: ${err.response?.data?.message || err.message}`);
      } else {
        setError('Failed to load deal details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this deal?')) {
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
      
      await axios.delete(`http://localhost:8000/api/admin/deals/${id}`, { headers });
      navigate('/deals');
    } catch (err) {
      console.error('Failed to delete deal:', err);
      setError('Failed to delete deal.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          <p className="text-sm text-zinc-500">Loading deal details...</p>
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

  if (!deal) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate('/deals')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Deals
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/deals/${id}/edit`)}
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
            <CardTitle className="text-2xl">{deal.swap.title}</CardTitle>
            <Badge>{deal.status.replace('_', ' ')}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div>
              <h3 className="font-medium mb-2">Swap Description</h3>
              <p className="text-zinc-500">{deal.swap.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Offering</h3>
                <p className="text-zinc-500">{deal.swap.offering}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Seeking</h3>
                <p className="text-zinc-500">{deal.swap.seeking}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Deal Status</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-500">Initiator Accepted:</span>
                  <Badge variant={deal.initiator_accepted ? "default" : "secondary"}>
                    {deal.initiator_accepted ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-500">Acceptor Accepted:</span>
                  <Badge variant={deal.acceptor_accepted ? "default" : "secondary"}>
                    {deal.acceptor_accepted ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Ratings</h3>
              <div className="space-y-2">
                <div className="text-sm text-zinc-500">
                  <span className="font-medium">Initiator Rating:</span> {deal.initiator_rating ?? 'Not rated'}
                  {deal.initiator_rating_score && ` (Score: ${deal.initiator_rating_score})`}
                </div>
                <div className="text-sm text-zinc-500">
                  <span className="font-medium">Acceptor Rating:</span> {deal.acceptor_rating ?? 'Not rated'}
                  {deal.acceptor_rating_score && ` (Score: ${deal.acceptor_rating_score})`}
                </div>
              </div>
            </div>

            {deal.report_reason && (
              <div>
                <h3 className="font-medium mb-2">Report Reason</h3>
                <p className="text-red-500">{deal.report_reason}</p>
              </div>
            )}

            <div>
              <h3 className="font-medium mb-2">Users</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Initiator</h4>
                  <div className="text-sm text-zinc-500">
                    <p>Name: {deal.initiator.name}</p>
                    <p>Email: {deal.initiator.email}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Acceptor</h4>
                  <div className="text-sm text-zinc-500">
                    <p>Name: {deal.acceptor.name}</p>
                    <p>Email: {deal.acceptor.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Timestamps</h3>
              <div className="text-sm text-zinc-500">
                <p>Created: {format(new Date(deal.created_at), 'MMM d, yyyy HH:mm:ss')}</p>
                <p>Last Updated: {format(new Date(deal.updated_at), 'MMM d, yyyy HH:mm:ss')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 