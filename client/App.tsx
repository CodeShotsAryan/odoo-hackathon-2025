import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { CurrentUserProvider } from './context/CurrentUserContext';

import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/user/UserDashboard';
import Receipts from './pages/operations/Receipts';
import ReceiptDetail from './pages/operations/ReceiptDetail';

import Deliveries from './pages/operations/Deliveries';
import DeliveryDetail from './pages/operations/DeliveryDetail';

import Adjustments from './pages/operations/Adjustments';
import AdjustmentForm from './pages/operations/AdjustmentForm';
import AdjustmentDetail from './pages/operations/AdjustmentDetail';
import MoveHistory from './pages/operations/MoveHistory';
import Stock from './pages/Stock'; 

import WarehousePage from './pages/settings/Warehouse';
import LocationsPage from './pages/settings/Locations';
import Layout from './components/Layout';
import DeliveryForm from './pages/operations/DeliveryForm';
import ReceiptForm from './pages/operations/ReceiptForm';
import Products from './pages/Products';

const MainLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      <Outlet />
    </div>
  );
};

const App = () => {
  return (
    <CurrentUserProvider>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <Routes>
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>
              
              <Route element={<MainLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/create-user" element={<AdminDashboard />} /> 
                
                <Route path="/dashboard" element={<UserDashboard />} />
                
                <Route path="/operations/receipts" element={<Receipts />} />
                <Route path="/operations/receipts/new" element={<ReceiptForm />} />
                <Route path="/operations/receipts/:id" element={<ReceiptDetail />} />
                
                <Route path="/operations/deliveries" element={<Deliveries />} />
                <Route path="/operations/deliveries/new" element={<DeliveryForm />} />
                <Route path="/operations/deliveries/:id" element={<DeliveryDetail />} />
                
                <Route path="/operations/adjustments" element={<Adjustments />} />
                <Route path="/operations/adjustments/new" element={<AdjustmentForm />} />
                <Route path="/operations/adjustments/:id" element={<AdjustmentDetail />} />
                
                <Route path="/stock" element={<Stock />} />
                <Route path="/products" element={<Products />} />
                
                <Route path="/operations/move-history" element={<MoveHistory />} />
                <Route path="/moves" element={<Navigate to="/operations/move-history" replace />} />
                
                <Route path="/settings" element={<Navigate to="/settings/warehouse" replace />} />
                <Route path="/settings/warehouse" element={<WarehousePage />} />
                <Route path="/settings/locations" element={<LocationsPage />} />
              </Route>
              
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </CurrentUserProvider>
  );
};

export default App;