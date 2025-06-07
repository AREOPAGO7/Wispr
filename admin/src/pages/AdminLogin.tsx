import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/api/admin/login', {
        email,
        password,
      });
      localStorage.setItem('adminToken', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-zinc-900/50 backdrop-blur-sm rounded-lg border border-zinc-800/50 shadow-2xl">
        <div>
          <h2 className="text-2xl font-bold text-center text-white mb-2">Admin Login</h2>
          <p className="text-zinc-400 text-center text-sm">Enter your credentials to access the dashboard</p>
        </div>
        
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">Email</label>
              <input
                type="email"
                id="email"
                className="block w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1">Password</label>
              <input
                type="password"
                id="password"
                className="block w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-900/50 border border-red-800/50">
              <p className="text-red-200 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-600 transition-colors"
          >
            Sign in to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;