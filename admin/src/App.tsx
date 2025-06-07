import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import SwapManagement from './pages/SwapManagement';
import ViewSwap from './pages/SwapManagement/ViewSwap';
import EditSwap from './pages/SwapManagement/EditSwap';
import DealManagement from './pages/DealManagement';
import ViewDeal from './pages/DealManagement/ViewDeal';
import EditDeal from './pages/DealManagement/EditDeal';
import CommentManagement from './pages/CommentManagement';
import MessageManagement from './pages/MessageManagement';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('adminToken') !== null;
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected content with DashboardLayout
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default function App() {
  return (
    <Routes>
        {/* Public routes */}
        <Route path="/login" element={<AdminLogin />} />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UserManagement />
            </PrivateRoute>
          }
        />

        <Route
          path="/swaps"
          element={
            <PrivateRoute>
              <SwapManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/swaps/:uid"
          element={
            <PrivateRoute>
              <ViewSwap />
            </PrivateRoute>
          }
        />
        <Route
          path="/swaps/:uid/edit"
          element={
            <PrivateRoute>
              <EditSwap />
            </PrivateRoute>
          }
        />

        <Route
          path="/deals"
          element={
            <PrivateRoute>
              <DealManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/deals/:id"
          element={
            <PrivateRoute>
              <ViewDeal />
            </PrivateRoute>
          }
        />
        <Route
          path="/deals/:id/edit"
          element={
            <PrivateRoute>
              <EditDeal />
            </PrivateRoute>
          }
        />

        <Route
          path="/comments"
          element={
            <PrivateRoute>
              <CommentManagement />
            </PrivateRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <PrivateRoute>
              <MessageManagement />
            </PrivateRoute>
          }
        />
        
        {/* Redirect to admin login if no other route matches */}
        <Route path="*" element={<AdminLogin />} />
    </Routes>
  );
}
