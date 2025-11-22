import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole, DashboardSummary, Operation } from '../../types';
import Layout from '../../components/Layout';
import { apiMock } from '../../services/mockApi';
import HeroCard from '../../components/dashboard/HeroCard';
import OperationsList from '../../components/dashboard/OperationsList';
import { ValidityChart, ActivityChart } from '../../components/dashboard/SmallCharts';
import FiltersBar from '../../components/dashboard/FiltersBar';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import CreateUser from '../admin/CreateUser'; // Reuse existing component for Admin Modal
import { Plus } from 'lucide-react';

interface DashboardProps {
  role?: UserRole;
}

const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<'createUser' | 'info' | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumData, opsData] = await Promise.all([
          apiMock.dashboard.getSummary(),
          apiMock.operations.list()
        ]);
        setSummary(sumData);
        setOperations(opsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (filters: any) => {
    // In real app, fetch new data with filters
    console.log('Filters applied:', filters);
    // Simulate loading state for effect
    setLoading(true);
    setTimeout(() => setLoading(false), 400); 
  };

  const handleHeroClick = (type: 'receipt' | 'delivery') => {
    if (type === 'receipt') navigate('/operations/receipts');
    if (type === 'delivery') navigate('/operations/deliveries');
  };

  const openCreateUser = () => {
    setModalContent('createUser');
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
          
          {/* Left Column: Operations Feed (2/3 width on large screens) */}
          <div className="xl:col-span-2 space-y-6">
            <FiltersBar onFilterChange={handleFilterChange} />
            {loading ? (
               <div className="h-96 bg-gray-100 dark:bg-dark-card rounded-2xl animate-pulse" />
            ) : (
               <OperationsList operations={operations} />
            )}
          </div>

          {/* Right Column: Charts & Summaries */}
          <div className="space-y-6">
            {loading ? (
              <>
                <div className="h-64 bg-gray-100 dark:bg-dark-card rounded-2xl animate-pulse" />
                <div className="h-48 bg-gray-100 dark:bg-dark-card rounded-2xl animate-pulse" />
              </>
            ) : summary ? (
              <>
                <ValidityChart data={summary.validityData} />
                <ActivityChart data={summary.activityData} />
                
                {/* Placeholder Mini Card */}
                <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                   <div className="relative z-10">
                      <h4 className="font-bold text-lg mb-2">Pro Tip</h4>
                      <p className="text-brand-100 text-sm">Check "Waiting" items daily to prevent backlog accumulation.</p>
                   </div>
                   <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={modalContent === 'createUser' ? 'Create New User' : 'Information'}
      >
        {modalContent === 'createUser' && <CreateUser />}
      </Modal>

    </Layout>
  );
};

export default Dashboard;