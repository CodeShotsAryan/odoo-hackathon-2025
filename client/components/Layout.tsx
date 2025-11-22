import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import { useCurrentUser } from '../context/CurrentUserContext';
import { UserRole } from '../types';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  userRole?: UserRole;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoading } = useCurrentUser();

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-dark-bg" />; // Prevent flash
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300 flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      {/* Added pt-16 to account for fixed navbar height */}
      <main className="flex-1 pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full animate-fade-in">
        {children}
      </main>
      
      {/* Simple Skip Link for A11y */}
      <a 
        href="#main-content" 
        className="fixed top-0 left-0 p-3 bg-brand-500 text-white -translate-y-full focus:translate-y-0 transition-transform z-[100]"
      >
        Skip to content
      </a>
    </div>
  );
};

export default Layout;