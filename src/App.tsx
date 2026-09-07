import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { BookingFlowProvider } from './hooks/useBookingFlow';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { SelectLocation } from './pages/SelectLocation';
import { SelectCrop } from './pages/SelectCrop';
import { SelectCenter } from './pages/SelectCenter';
import { AvailableSlots } from './pages/AvailableSlots';
import { BookingConfirmation } from './pages/BookingConfirmation';
import { DigitalTokenView } from './pages/DigitalTokenView';
import { MyBookings } from './pages/MyBookings';
import { ProcurementStatusView } from './pages/ProcurementStatusView';
import { PaymentStatusView } from './pages/PaymentStatusView';
import { Profile } from './pages/Profile';
import { Notifications } from './pages/Notifications';

// Protected Route wrapper component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Root index redirect based on auth
const RootRedirect: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BookingFlowProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={<RootRedirect />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/select-location"
              element={
                <ProtectedRoute>
                  <SelectLocation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/select-crop"
              element={
                <ProtectedRoute>
                  <SelectCrop />
                </ProtectedRoute>
              }
            />
            <Route
              path="/select-center"
              element={
                <ProtectedRoute>
                  <SelectCenter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/slots"
              element={
                <ProtectedRoute>
                  <AvailableSlots />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking-confirmation"
              element={
                <ProtectedRoute>
                  <BookingConfirmation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/token"
              element={
                <ProtectedRoute>
                  <DigitalTokenView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/token/:id"
              element={
                <ProtectedRoute>
                  <DigitalTokenView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/procurement-status"
              element={
                <ProtectedRoute>
                  <ProcurementStatusView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/procurement-status/:id"
              element={
                <ProtectedRoute>
                  <ProcurementStatusView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-status"
              element={
                <ProtectedRoute>
                  <PaymentStatusView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-status/:id"
              element={
                <ProtectedRoute>
                  <PaymentStatusView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </BookingFlowProvider>
    </AuthProvider>
  );
}
