import React from 'react';
import Dashboard from '../dashboard/Dashboard';
import { UserRole } from '../../types';

const UserDashboard = () => {
  return <Dashboard role={UserRole.USER} />;
};

export default UserDashboard;