import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { 
  StudentDashboard, 
  FindAccommodation, 
  FindRestaurants, 
  MyBookings,
  StudentRequests
} from './pages/StudentPages';
import { 
  BoardingOwnerDashboard, 
  AddRoom, 
  ManageRooms 
} from './pages/BoardingOwnerPages';
import { 
  RestaurantOwnerDashboard, 
  AddMenuItem 
} from './pages/RestaurantOwnerPages';
import { 
  AdminDashboard, 
  UsersManagement 
} from './pages/AdminPages';
import { ShieldAlert } from 'lucide-react';
import { Button } from './components/UI';

const UnauthorizedPage = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center space-y-6">
    <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center text-red-600 shadow-lg shadow-red-100">
      <ShieldAlert size={48} />
    </div>
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-slate-900">Access Denied</h1>
      <p className="text-slate-500 max-w-md">You don't have the required permissions to access this page. Please contact your administrator if you believe this is an error.</p>
    </div>
    <Button onClick={() => window.history.back()}>Go Back</Button>
  </div>
);

const NotFoundPage = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center space-y-6">
    <h1 className="text-9xl font-black text-slate-200">404</h1>
    <div className="space-y-2">
      <h2 className="text-3xl font-bold text-slate-900">Page Not Found</h2>
      <p className="text-slate-500">The page you are looking for doesn't exist or has been moved.</p>
    </div>
    <Button onClick={() => window.location.href = '/'}>Return Home</Button>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Student Routes */}
          <Route path="/dashboard/student" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <DashboardLayout><StudentDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/find-accommodation" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <DashboardLayout><FindAccommodation /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/find-restaurants" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <DashboardLayout><FindRestaurants /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/my-bookings" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <DashboardLayout><MyBookings /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/requests" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <DashboardLayout><StudentRequests /></DashboardLayout>
            </ProtectedRoute>
          } />
          {/* Add more student routes as needed */}

          {/* Boarding Owner Routes */}
          <Route path="/dashboard/boarding-owner" element={
            <ProtectedRoute allowedRoles={['BOARDING_OWNER']}>
              <DashboardLayout><BoardingOwnerDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/boarding/add-room" element={
            <ProtectedRoute allowedRoles={['BOARDING_OWNER']}>
              <DashboardLayout><AddRoom /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/boarding/manage-rooms" element={
            <ProtectedRoute allowedRoles={['BOARDING_OWNER']}>
              <DashboardLayout><ManageRooms /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Restaurant Owner Routes */}
          <Route path="/dashboard/restaurant-owner" element={
            <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
              <DashboardLayout><RestaurantOwnerDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/restaurant/add-menu" element={
            <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
              <DashboardLayout><AddMenuItem /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/dashboard/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout><AdminDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout><UsersManagement /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
