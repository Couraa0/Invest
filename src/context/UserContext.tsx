import React, { createContext, useContext, useState } from 'react';

type InvestorLevel = 'Pemula' | 'Menengah' | 'Berpengalaman';

interface UserContextType {
  investorLevel: InvestorLevel;
  setInvestorLevel: (level: InvestorLevel) => void;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: (level: InvestorLevel) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('hasCompletedOnboarding') === 'true';
  });

  const [investorLevel, setInvestorLevelState] = useState<InvestorLevel>(() => {
    const saved = localStorage.getItem('investorLevel');
    return (saved as InvestorLevel) || 'Pemula';
  });

  const setInvestorLevel = (level: InvestorLevel) => {
    setInvestorLevelState(level);
    localStorage.setItem('investorLevel', level);
  };

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setHasCompletedOnboarding(false);
    setInvestorLevel('Pemula');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('hasCompletedOnboarding');
    localStorage.removeItem('investorLevel');
  };

  const completeOnboarding = (level: InvestorLevel) => {
    setInvestorLevel(level);
    setHasCompletedOnboarding(true);
    localStorage.setItem('hasCompletedOnboarding', 'true');
  };

  return (
    <UserContext.Provider value={{ 
      investorLevel, 
      setInvestorLevel,
      isAuthenticated,
      login,
      logout,
      hasCompletedOnboarding,
      completeOnboarding
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
