import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '../types/auth';
import { 
  getStoredToken, 
  getStoredUser, 
  loginUser as apiLogin, 
  registerUser as apiRegister, 
  requestPasswordReset as apiReset, 
  clearStoredSession, 
  verifyCurrentSession 
} from '../services/authService';

export type AuthModalMode = 'login' | 'register' | 'forgot' | null;

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeModal: AuthModalMode;
  openLogin: () => void;
  openRegister: () => void;
  openForgotPassword: () => void;
  closeModal: () => void;
  login: (params: { email: string; password: string; autoRegisterIfMissing?: boolean; fullName?: string }) => Promise<AuthResponse>;
  register: (params: { fullName: string; email: string; password: string }) => Promise<AuthResponse>;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<AuthModalMode>(null);

  // Sync / verify session on app mount
  useEffect(() => {
    let mounted = true;
    const initAuth = async () => {
      const storedToken = getStoredToken();
      if (!storedToken) {
        if (mounted) {
          setUser(null);
          setToken(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const verifiedUser = await verifyCurrentSession();
        if (mounted) {
          if (verifiedUser) {
            setUser(verifiedUser);
            setToken(storedToken);
          } else {
            setUser(null);
            setToken(null);
          }
        }
      } catch (err) {
        if (mounted) {
          // Fallback to local stored user
          setUser(getStoredUser());
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();
    return () => {
      mounted = false;
    };
  }, []);

  const openLogin = () => setActiveModal('login');
  const openRegister = () => setActiveModal('register');
  const openForgotPassword = () => setActiveModal('forgot');
  const closeModal = () => setActiveModal(null);

  const login = async (params: { email: string; password: string; autoRegisterIfMissing?: boolean; fullName?: string }): Promise<AuthResponse> => {
    const res = await apiLogin(params);
    if (res.success && res.user && res.token) {
      setUser(res.user);
      setToken(res.token);
    }
    return res;
  };

  const register = async (params: { fullName: string; email: string; password: string }): Promise<AuthResponse> => {
    const res = await apiRegister(params);
    if (res.success && res.user && res.token) {
      setUser(res.user);
      setToken(res.token);
    }
    return res;
  };

  const forgotPassword = async (email: string): Promise<AuthResponse> => {
    return await apiReset(email);
  };

  const logout = () => {
    clearStoredSession();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        activeModal,
        openLogin,
        openRegister,
        openForgotPassword,
        closeModal,
        login,
        register,
        forgotPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
