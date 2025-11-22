
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { CurrentUserProvider } from './context/CurrentUserContext';

// Pages
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
import { Construction } from 'lucide-react';

// Placeholder for Pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in">
     <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center mb-6">
       <Construction className="w-10 h-10 text-brand-500" />
     </div>
     <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
     <p className="text-gray-500 dark:text-gray-400">This module is currently under development.</p>
  </div>
);

// Layout wrapper for protected routes
const MainLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

// Simple wrapper for auth pages (no navbar)
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
              {/* Public Auth Routes (No Navbar) */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>
              
              {/* Protected Routes (With Navbar) */}
              <Route element={<MainLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/create-user" element={<AdminDashboard />} /> 
                
                <Route path="/dashboard" element={<UserDashboard />} />
                
                {/* Operations */}
                <Route path="/operations/receipts" element={<Receipts />} />
                <Route path="/operations/receipts/new" element={<PlaceholderPage title="New Receipt" />} />
                <Route path="/operations/receipts/:id" element={<ReceiptDetail />} />
                
                <Route path="/operations/deliveries" element={<Deliveries />} />
                <Route path="/operations/deliveries/new" element={<PlaceholderPage title="New Delivery Order" />} />
                <Route path="/operations/deliveries/:id" element={<DeliveryDetail />} />
                
                <Route path="/operations/adjustments" element={<Adjustments />} />
                <Route path="/operations/adjustments/new" element={<AdjustmentForm />} />
                <Route path="/operations/adjustments/:id" element={<AdjustmentDetail />} />
                
                {/* Inventory */}
                <Route path="/stock" element={<Stock />} />
                
                {/* Move History */}
                <Route path="/operations/move-history" element={<MoveHistory />} />
                <Route path="/moves" element={<Navigate to="/operations/move-history" replace />} /> {/* Alias */}
                <Route path="/operations/move-history/new" element={<PlaceholderPage title="New Stock Move" />} />
                <Route path="/operations/move-history/:id" element={<PlaceholderPage title="Move Details — Coming Soon" />} />
                
                {/* Settings */}
                <Route path="/settings" element={<Navigate to="/settings/warehouse" replace />} />
                <Route path="/settings/warehouse" element={<WarehousePage />} />
                <Route path="/settings/locations" element={<LocationsPage />} />

                {/* Other Placeholders */}
                <Route path="/products" element={<PlaceholderPage title="Product Management" />} />
              </Route>
              
              {/* Default Redirect */}
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
