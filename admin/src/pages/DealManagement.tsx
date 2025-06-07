import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Search, Pencil, Trash2, Eye, Loader2 } from 'lucide-react';

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
}

interface Deal {
  id: number;
  swap_id: number;
  initiator_id: number;
  acceptor_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  swap: Swap;
  initiator: User;
  acceptor: User;
}

interface ApiResponse {
  data: Deal[];
  total: number;
}

const DealManagement: React.FC = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      
      const response = await axios.get<{ data: Deal[] }>('http://localhost:8000/api/admin/deals', { headers });
      
      if (response.data && Array.isArray(response.data.data)) {
        setDeals(response.data.data);
      } else {
        console.error('Unexpected API response format:', response.data);
        setError('Invalid data format received from server.');
      }
    } catch (err) {
      console.error('Failed to fetch deals:', err);
      if (axios.isAxiosError(err)) {
        setError(`Failed to load deals: ${err.response?.data?.message || err.message}`);
      } else {
        setError('Failed to load deals.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDeal = async (dealId: number) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };
        await axios.delete(`http://localhost:8000/api/admin/deals/${dealId}`, { headers });
        fetchDeals(); // Refresh the list after deletion
      } catch (err) {
        console.error('Failed to delete deal:', err);
        setError('Failed to delete deal.');
      }
    }
  };

  const handleViewDeal = (dealId: number) => {
    navigate(`/deals/${dealId}`);
  };

  const handleEditDeal = (dealId: number) => {
    navigate(`/deals/${dealId}/edit`);
  };

  const filteredDeals = deals.filter(deal =>
    deal.swap?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.swap?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.initiator?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.acceptor?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  if (loading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          <p className="text-sm text-zinc-500">Loading deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Deal Management</h1>
        <p className="text-zinc-500">Manage and monitor all deals in the system.</p>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search deals by swap title, description, or user names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950"
          />
        </div>
      </div>

      {!deals.length ? (
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-[450px] items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-center">
              <Search className="h-8 w-8 text-zinc-400" />
              <p className="font-medium">No deals found</p>
              <p className="text-sm text-zinc-500">Deals will appear here when users make swaps</p>
            </div>
          </div>
        </div>
      ) : filteredDeals.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-[450px] items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-center">
              <Search className="h-8 w-8 text-zinc-400" />
              <p className="font-medium">No deals found</p>
              <p className="text-sm text-zinc-500">Try adjusting your search terms</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="relative overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Swap Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Users</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredDeals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <td className="px-6 py-4">
                      <div className="font-medium">{deal.swap.title}</div>
                      <div className="text-sm text-zinc-500 line-clamp-2">{deal.swap.description}</div>
                      <div className="text-xs text-zinc-500">ID: {deal.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">Initiator:</span> {deal.initiator.name}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Acceptor:</span> {deal.acceptor.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        deal.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        deal.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}>
                        {deal.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(deal.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewDeal(deal.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                          title="View Deal"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditDeal(deal.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                          title="Edit Deal"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDeal(deal.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                          title="Delete Deal"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealManagement;