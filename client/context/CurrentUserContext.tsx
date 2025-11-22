import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface CurrentUserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  toggleRole: () => void; // Helper for dev testing
}

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export const CurrentUserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock auth check on mount
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') as UserRole;
    
    if (token) {
      // Simulate fetching user profile
      setUser({
        id: 'current-user-id',
        username: role === UserRole.ADMIN ? 'Admin User' : 'Demo User',
        email: role === UserRole.ADMIN ? 'admin@stockmaster.io' : 'user@stockmaster.io',
        role: role || UserRole.USER,
        avatarUrl: `https://ui-avatars.com/api/?name=${role === UserRole.ADMIN ? 'Admin' : 'User'}&background=FF7A1A&color=fff`
      });
    }
    setIsLoading(false);
  }, []);

  const toggleRole = () => {
    if (!user) return;
    const newRole = user.role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN;
    const newUser = { ...user, role: newRole, username: newRole === UserRole.ADMIN ? 'Admin User' : 'Demo User' };
    setUser(newUser);
    localStorage.setItem('role', newRole);
  };

  return (
    <CurrentUserContext.Provider value={{ user, setUser, isLoading, toggleRole }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider');
  }
  return context;
};