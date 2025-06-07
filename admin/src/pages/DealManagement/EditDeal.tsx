import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft } from 'lucide-react';

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
}

export default function EditDeal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<DealDetails>>({
    status: '',
    initiator_accepted: false,
    acceptor_accepted: false,
  });

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
      const { status, initiator_accepted, acceptor_accepted } = response.data;
      setFormData({ status, initiator_accepted, acceptor_accepted });
    } catch (err) {
      console.error('Failed to fetch deal details:', err);
      setError('Failed to load deal details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      
      await axios.put(`http://localhost:8000/api/admin/deals/${id}`, formData, { headers });
      navigate(`/deals/${id}`);
    } catch (err) {
      console.error('Failed to update deal:', err);
      setError('Failed to update deal.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleAcceptanceChange = (field: 'initiator_accepted' | 'acceptor_accepted', value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate(`/deals/${id}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Deal Details
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Deal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Acceptance Status</Label>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="initiator_accepted"
                    checked={formData.initiator_accepted}
                    onChange={(e) => handleAcceptanceChange('initiator_accepted', e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="initiator_accepted">Initiator Accepted</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="acceptor_accepted"
                    checked={formData.acceptor_accepted}
                    onChange={(e) => handleAcceptanceChange('acceptor_accepted', e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="acceptor_accepted">Acceptor Accepted</Label>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200/30 bg-red-500/5 p-4">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/deals/${id}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="min-w-[100px]"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 