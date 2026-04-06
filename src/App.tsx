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
  StudentRequests,
  AllReviewsPage
} from './pages/StudentPages';
import { ProfilePage } from './pages/ProfilePage';
import { 
  DashboardOverview, 
  AddListingForm, 
  ListingsPage,
  BookingsPage,
  RequestsPage,
  ReviewsPage,
  OwnerProfilePage
} from './pages/BoardingOwnerPages';
import { 
  RestaurantOwnerDashboard, 
  MyRestaurantPage,
  ManageMenu,
  RestaurantOrders,
  RestaurantReviews,
  RestaurantPublicProfile
} from './pages/RestaurantOwnerPages';
import { 
  AdminDashboard, 
  AdminUserManagement,
  AdminContentManagement,
  AdminReportsManager,
  AdminReviewsManager
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
          <Route path="/student/reviews" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <DashboardLayout><AllReviewsPage /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Common Routes */}
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'BOARDING_OWNER', 'RESTAURANT_OWNER', 'ADMIN']}>
              <DashboardLayout><ProfilePage /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Boarding Owner Routes */}
          <Route path="/owner-dashboard" element={
            <ProtectedRoute allowedRoles={['BOARDING_OWNER']}>
              <DashboardLayout><DashboardOverview /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/owner/listings" element={
            <ProtectedRoute allowedRoles={['BOARDING_OWNER']}>
              <DashboardLayout><ListingsPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/owner/add-listing" element={
            <ProtectedRoute allowedRoles={['BOARDING_OWNER']}>
              <DashboardLayout><AddListingForm /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/owner/bookings" element={
            <ProtectedRoute allowedRoles={['BOARDING_OWNER']}>
              <DashboardLayout><BookingsPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/owner/student-requests" element={
            <ProtectedRoute allowedRoles={['BOARDING_OWNER']}>
              <DashboardLayout><RequestsPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/owner/reviews" element={
            <ProtectedRoute allowedRoles={['BOARDING_OWNER']}>
              <DashboardLayout><ReviewsPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/owner/profile" element={
            <ProtectedRoute allowedRoles={['BOARDING_OWNER']}>
              <DashboardLayout><OwnerProfilePage /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Restaurant Owner Routes */}
          <Route path="/restaurant-dashboard" element={
            <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
              <DashboardLayout><RestaurantOwnerDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/restaurant/my-restaurant" element={
            <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
              <DashboardLayout><MyRestaurantPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/restaurant/menu" element={
            <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
              <DashboardLayout><ManageMenu /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/restaurant/orders" element={
            <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
              <DashboardLayout><RestaurantOrders /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/restaurant/reviews" element={
            <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
              <DashboardLayout><RestaurantReviews /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/restaurant/profile" element={
            <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}>
              <DashboardLayout><RestaurantPublicProfile /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout><AdminDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout><AdminUserManagement /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/content" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout><AdminContentManagement /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/issues" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout><AdminReportsManager /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/reviews" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout><AdminReviewsManager /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
