import React from 'react';
import Dashboard from '../dashboard/Dashboard';
import { UserRole } from '../../types';

const AdminDashboard = () => {
  return <Dashboard role={UserRole.ADMIN} />;
};

export default AdminDashboard;