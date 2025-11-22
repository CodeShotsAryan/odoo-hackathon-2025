import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types';
import Layout from '../../components/Layout';
import apiService from '../../services/api';
import HeroCard from '../../components/dashboard/HeroCard';
import { ValidityChart, ActivityChart } from '../../components/dashboard/SmallCharts';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import CreateUser from '../admin/CreateUser';
import { Plus } from 'lucide-react';

interface DashboardProps {
  role?: UserRole;
}

const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiService.dashboard.getSummary();
        
        // Transform backend data to match frontend format
        setSummary({
          receiptCount: 0, // Add logic based on your needs
          deliveryCount: 0,
          receiptStats: { late: 0, waiting: 0, total: data.total_products || 0 },
          deliveryStats: { late: 0, waiting: 0, total: data.low_stock_items || 0 },
          validityData: { 
            valid: Math.floor(data.total_stock * 0.65) || 65, 
            invalid: Math.floor(data.total_stock * 0.15) || 15, 
            resources: Math.floor(data.total_stock * 0.20) || 20 
          },
          activityData: [12, 18, 15, 25, 22, 30, 28, 35, 20, 40, 38, 45] // Mock for now
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleHeroClick = (type: 'receipt' | 'delivery') => {
    if (type === 'receipt') navigate('/operations/receipts');
    if (type === 'delivery') navigate('/operations/deliveries');
  };

  const openCreateUser = () => {
    setIsModalOpen(true);
  };

  return (
    <Layout showSidebar userRole={role}>
      <div className="space-y-8">
        
        {/* Header Section with Admin Action */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slide-up">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of inventory operations and status.</p>
          </div>
          
          {role === UserRole.ADMIN && (
            <Button onClick={openCreateUser} className="shadow-lg shadow-brand-500/20 glow-orange">
              <Plus size={20} className="mr-2" /> Create User
            </Button>
          )}
        </div>

        {/* Hero Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          {loading ? (
            <>
               <div className="h-48 bg-gray-100 dark:bg-dark-card rounded-2xl animate-pulse" />
               <div className="h-48 bg-gray-100 dark:bg-dark-card rounded-2xl animate-pulse" />
            </>
          ) : summary ? (
            <>
              <HeroCard 
                type="receipt" 
                count={summary.receiptCount} 
                stats={summary.receiptStats} 
                onClick={() => handleHeroClick('receipt')} 
              />
              <HeroCard 
                type="delivery" 
                count={summary.deliveryCount} 
                stats={summary.deliveryStats} 
                onClick={() => handleHeroClick('delivery')} 
              />
            </>
          ) : null}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
          {loading ? (
            <>
              <div className="h-64 bg-gray-100 dark:bg-dark-card rounded-2xl animate-pulse" />
              <div className="h-48 bg-gray-100 dark:bg-dark-card rounded-2xl animate-pulse" />
            </>
          ) : summary ? (
            <>
              <ValidityChart data={summary.validityData} />
              <ActivityChart data={summary.activityData} />
            </>
          ) : null}
        </div>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create New User"
      >
        <CreateUser onSuccess={() => setIsModalOpen(false)} />
      </Modal>

    </Layout>
  );
};

export default Dashboard;