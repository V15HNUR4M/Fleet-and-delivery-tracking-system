import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import RoleGuard from './auth/RoleGuard';
import Sidebar from './components/layout/Sidebar';
import TopNavbar from './components/layout/TopNavbar';

// Pages
import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import VehiclesPage from './pages/Vehicles/VehiclesPage';
import DriversPage from './pages/Drivers/DriversPage';
import OrdersPage from './pages/Orders/OrdersPage';
import OrderDetailPage from './pages/OrderDetail/OrderDetailPage';
import DispatchPage from './pages/Dispatch/DispatchPage';
import TrackingPage from './pages/Tracking/TrackingPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import AdminPage from './pages/Admin/AdminPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';

// Role-aware root page
const DashboardRoute = () => {
  const { user } = useAuth();
  if (user?.role === 'CUSTOMER' || user?.role === 'DRIVER') {
    return <Navigate to="/orders" replace />;
  }
  return <DashboardPage />;
};

// App shell layout wrapping all authenticated pages
const AppShell = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <div className="app-main">
        <TopNavbar onMenuClick={() => setMobileSidebarOpen((o) => !o)} />
        <main className="app-content" id="main-content" role="main">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a2030',
            color: '#f0f4ff',
            border: '1px solid #2a3348',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#1a2030' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#1a2030' },
          },
        }}
      />

      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell>
                <DashboardRoute />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <AppShell>
                <RoleGuard allowedRoles={['ADMIN', 'DISPATCHER']}>
                  <VehiclesPage />
                </RoleGuard>
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/drivers"
          element={
            <ProtectedRoute>
              <AppShell>
                <RoleGuard allowedRoles={['ADMIN', 'DISPATCHER']}>
                  <DriversPage />
                </RoleGuard>
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <AppShell>
                <OrdersPage />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <AppShell>
                <OrderDetailPage />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dispatch"
          element={
            <ProtectedRoute>
              <AppShell>
                <RoleGuard allowedRoles={['ADMIN', 'DISPATCHER']}>
                  <DispatchPage />
                </RoleGuard>
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tracking"
          element={
            <ProtectedRoute>
              <AppShell>
                <RoleGuard allowedRoles={['ADMIN', 'DISPATCHER', 'DRIVER']}>
                  <TrackingPage />
                </RoleGuard>
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AppShell>
                <RoleGuard allowedRoles={['ADMIN', 'DISPATCHER']}>
                  <AnalyticsPage />
                </RoleGuard>
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AppShell>
                <RoleGuard allowedRoles={['ADMIN']}>
                  <AdminPage />
                </RoleGuard>
              </AppShell>
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <AppShell>
                <NotFoundPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
