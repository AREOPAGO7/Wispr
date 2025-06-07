import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Edit, Trash2, Eye } from 'lucide-react';

interface Message {
  id: number;
  sender_email: string;
  receiver_email: string;
  content: string;
  // Add other message properties as needed
}

const MessageManagement: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get<Message[]>('http://localhost:8000/api/admin/messages', { headers });
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };
        await axios.delete(`http://localhost:8000/api/admin/messages/${messageId}`, { headers });
        fetchMessages(); // Refresh the list after deletion
      } catch (err) {
        console.error('Failed to delete message:', err);
        setError('Failed to delete message.');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading messages...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-lg text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Message Management</h1>
        <p className="text-gray-600 mb-8">Manage all user messages.</p>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receiver Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {messages.map((message) => (
                <tr key={message.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{message.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{message.sender_email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{message.receiver_email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{message.content}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Delete" onClick={() => handleDeleteMessage(message.id)}>
                        <Trash2 size={18} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900" title="View">
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MessageManagement;