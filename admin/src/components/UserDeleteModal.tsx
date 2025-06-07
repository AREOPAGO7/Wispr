import React, { useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserDeleteModalProps {
  user: User;
  onClose: () => void;
  onDelete: (userId: number) => void;
}

const UserDeleteModal: React.FC<UserDeleteModalProps> = ({ user, onClose, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`http://localhost:8000/api/admin/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onDelete(user.id);
      onClose();
    } catch (err) {
      console.error('Error deleting user:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Failed to delete user.');
      } else {
        setError('Failed to delete user.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-zinc-700">
        <h2 className="text-xl font-semibold text-white mb-4">Delete User: {user.name}</h2>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <p className="text-zinc-300 mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;
