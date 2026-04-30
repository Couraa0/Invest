import React, { createContext, useContext, useState, useEffect } from 'react';

type InvestorLevel = 'Pemula' | 'Menengah' | 'Berpengalaman';

interface UserContextType {
  investorLevel: InvestorLevel;
  setInvestorLevel: (level: InvestorLevel) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [investorLevel, setInvestorLevelState] = useState<InvestorLevel>(() => {
    const saved = localStorage.getItem('investorLevel');
    return (saved as InvestorLevel) || 'Pemula';
  });

  const setInvestorLevel = (level: InvestorLevel) => {
    setInvestorLevelState(level);
    localStorage.setItem('investorLevel', level);
  };

  return (
    <UserContext.Provider value={{ investorLevel, setInvestorLevel }}>
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
