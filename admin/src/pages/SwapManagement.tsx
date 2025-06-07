import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Search, Pencil, Trash2, Eye, Loader2 } from 'lucide-react';

interface Swap {
  id: number;
  uid: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  // Add other swap properties as needed
}

interface ApiResponse {
  data: Swap[];
  // Add other response properties if needed
}

const SwapManagement: React.FC = () => {
  const navigate = useNavigate();
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSwaps();
  }, []);

  const fetchSwaps = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get<ApiResponse>('http://localhost:8000/api/admin/swaps', { headers });
      
      if (response.data && Array.isArray(response.data.data)) {
        setSwaps(response.data.data);
      } else {
        console.error('Unexpected API response format:', response.data);
        setError('Invalid data format received from server.');
      }
    } catch (err) {
      console.error('Failed to fetch swaps:', err);
      setError('Failed to load swaps.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSwap = async (swapId: number) => {
    if (window.confirm('Are you sure you want to delete this swap?')) {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };
        await axios.delete(`http://localhost:8000/api/admin/swaps/${swapId}`, { headers });
        fetchSwaps(); // Refresh the list after deletion
      } catch (err) {
        console.error('Failed to delete swap:', err);
        setError('Failed to delete swap.');
      }
    }
  };

  const handleViewSwap = (uid: string) => {
    navigate(`/swaps/${uid}`);
  };

  const handleEditSwap = (uid: string) => {
    navigate(`/swaps/${uid}/edit`);
  };

  const filteredSwaps = swaps.filter(swap =>
    swap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    swap.description.toLowerCase().includes(searchQuery.toLowerCase())
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
          <p className="text-sm text-zinc-500">Loading swaps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Swaps</h2>
          <p className="text-sm text-zinc-500">
            Manage skill swaps and exchanges on the platform.
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
          <Plus className="mr-2 h-4 w-4" />
          Add Swap
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search swaps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-zinc-200 bg-white pl-9 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950"
          />
        </div>
      </div>

      {filteredSwaps.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-[450px] items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-center">
              <Search className="h-8 w-8 text-zinc-400" />
              <p className="font-medium">No swaps found</p>
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
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {Array.isArray(filteredSwaps) && filteredSwaps.map((swap) => (
                  <tr key={swap.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{swap.title}</div>
                      <div className="text-xs text-zinc-500">ID: {swap.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm line-clamp-2">{swap.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        swap.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        swap.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}>
                        {swap.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(swap.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewSwap(swap.uid)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                          title="View Swap"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditSwap(swap.uid)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                          title="Edit Swap"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSwap(swap.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                          title="Delete Swap"
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

export default SwapManagement;