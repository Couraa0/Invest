import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api, DbUser, setToken, clearToken, getToken } from '../lib/api';

type InvestorLevel = 'Pemula' | 'Menengah' | 'Berpengalaman';

interface UserContextType {
  investorLevel: InvestorLevel;
  setInvestorLevel: (level: InvestorLevel) => void;
  isAuthenticated: boolean;
  user: DbUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: (token: string) => Promise<{ success: boolean; message: string }>;
  register: (email: string, password: string, fullName: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: (level: InvestorLevel) => void;
  updateProfile: (payload: Partial<{ full_name: string; risk_profile: string; avatar_url: string }>) => Promise<{ success: boolean; message: string }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<DbUser | null>(() => {
    try {
      const saved = localStorage.getItem('investai_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getToken());

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('hasCompletedOnboarding') === 'true';
  });

  const [investorLevel, setInvestorLevelState] = useState<InvestorLevel>(() => {
    const saved = localStorage.getItem('investorLevel');
    return (saved as InvestorLevel) || 'Pemula';
  });

  // Verify token on mount
  useEffect(() => {
    const token = getToken();
    if (!token) { setIsLoading(false); return; }
    api.auth.me()
      .then(userData => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('investai_user', JSON.stringify(userData));
        localStorage.setItem('investai_user_id', userData.id);
      })
      .catch(() => {
        // Token invalid
        clearToken();
        setUser(null);
        setIsAuthenticated(false);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const setInvestorLevel = (level: InvestorLevel) => {
    setInvestorLevelState(level);
    localStorage.setItem('investorLevel', level);
  };

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.auth.login({ email, password });
      setToken(res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      localStorage.setItem('investai_user', JSON.stringify(res.user));
      localStorage.setItem('investai_user_id', res.user.id);
      return { success: true, message: 'Login berhasil!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login gagal' };
    }
  }, []);

  const loginWithGoogle = useCallback(async (token: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.auth.googleLogin(token);
      setToken(res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      localStorage.setItem('investai_user', JSON.stringify(res.user));
      localStorage.setItem('investai_user_id', res.user.id);
      return { success: true, message: 'Login Google berhasil!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login Google gagal' };
    }
  }, []);

  const register = useCallback(async (email: string, password: string, fullName: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.auth.register({ email, password, full_name: fullName });
      setToken(res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      localStorage.setItem('investai_user', JSON.stringify(res.user));
      localStorage.setItem('investai_user_id', res.user.id);
      return { success: true, message: 'Registrasi berhasil!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Registrasi gagal' };
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setIsAuthenticated(false);
    setHasCompletedOnboarding(false);
    setInvestorLevel('Pemula');
    localStorage.removeItem('investai_user');
    localStorage.removeItem('investai_user_id');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('hasCompletedOnboarding');
    localStorage.removeItem('investorLevel');
    localStorage.removeItem('paper_trading_state');
  }, []);

  const completeOnboarding = (level: InvestorLevel) => {
    setInvestorLevel(level);
    setHasCompletedOnboarding(true);
    localStorage.setItem('hasCompletedOnboarding', 'true');
  };

  const updateProfile = useCallback(async (payload: Partial<{ full_name: string; risk_profile: string; avatar_url: string }>) => {
    if (!user) return { success: false, message: 'Not logged in' };
    try {
      const res = await api.users.update(user.id, payload);
      setUser(res.user);
      localStorage.setItem('investai_user', JSON.stringify(res.user));
      // Update investorLevel if risk profile changed
      if (res.user.risk_profile === 'Agresif') setInvestorLevel('Berpengalaman');
      else if (res.user.risk_profile === 'Moderat') setInvestorLevel('Menengah');
      else if (res.user.risk_profile === 'Konservatif') setInvestorLevel('Pemula');
      
      return { success: true, message: 'Profil berhasil diperbarui' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Gagal memperbarui profil' };
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ 
      investorLevel, 
      setInvestorLevel,
      isAuthenticated,
      user,
      isLoading,
      login,
      loginWithGoogle,
      register,
      logout,
      hasCompletedOnboarding,
      completeOnboarding,
      updateProfile
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
