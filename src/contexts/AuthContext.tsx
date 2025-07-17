
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  token: string | null;
  userId: number | null;
  email: string | null;
  isAuthenticated: boolean;
  login: (token: string, userId: number, email: string, remember: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const restoreAuthState = () => {
      try {
        console.log('🔄 Starting auth state restoration...');
        
        // Check localStorage first, then sessionStorage
        let savedToken = localStorage.getItem("token");
        let savedUserId = localStorage.getItem("userId");
        let savedEmail = localStorage.getItem("email");
        let storageType = 'localStorage';

        // If not in localStorage, check sessionStorage
        if (!savedToken) {
          savedToken = sessionStorage.getItem("token");
          savedUserId = sessionStorage.getItem("userId");
          savedEmail = sessionStorage.getItem("email");
          storageType = 'sessionStorage';
        }

        console.log('📋 Storage check results:', {
          storageType,
          hasToken: !!savedToken,
          hasUserId: !!savedUserId,
          hasEmail: !!savedEmail,
          tokenPreview: savedToken ? `${savedToken.substring(0, 10)}...` : 'none'
        });

        // Only set auth state if we have ALL required data
        if (savedToken && savedUserId && savedEmail) {
          console.log('✅ Restoring complete auth state from', storageType);
          setToken(savedToken);
          setUserId(Number(savedUserId));
          setEmail(savedEmail);
        } else {
          console.log('❌ Incomplete auth data found:', {
            token: savedToken ? '✓' : '✗',
            userId: savedUserId ? '✓' : '✗',
            email: savedEmail ? '✓' : '✗'
          });
        }
      } catch (error) {
        console.error('💥 Error restoring auth state:', error);
      } finally {
        setIsInitialized(true);
        console.log('🏁 Auth initialization complete');
      }
    };

    restoreAuthState();
  }, []);

  const login = (newToken: string, newUserId: number, newEmail: string, remember: boolean) => {
    try {
      const storage = remember ? localStorage : sessionStorage;
      console.log('🔐 Logging in user:', { 
        userId: newUserId, 
        email: newEmail, 
        remember,
        storageType: remember ? 'localStorage' : 'sessionStorage'
      });
      
      // Clear any existing auth data from both storages to avoid conflicts
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("email");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("email");
      
      // Set new auth data in the chosen storage
      storage.setItem("token", newToken);
      storage.setItem("userId", String(newUserId));
      storage.setItem("email", newEmail);

      // Update state immediately
      setToken(newToken);
      setUserId(newUserId);
      setEmail(newEmail);
      
      console.log('✅ Login successful - auth state updated');
    } catch (error) {
      console.error('💥 Error during login:', error);
    }
  };

  const logout = () => {
    try {
      console.log('🚪 Manually logging out user');
      
      // Clear all auth data from both storages
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("email");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("email");
      
      // Clear state
      setToken(null);
      setUserId(null);
      setEmail(null);
      
      console.log('✅ Logout complete');
    } catch (error) {
      console.error('💥 Error during logout:', error);
    }
  };

  // Log auth state changes for debugging - but prevent infinite loops
  useEffect(() => {
    if (isInitialized) {
      console.log('🔄 Auth state update:', {
        isAuthenticated: !!token,
        hasToken: !!token,
        hasUserId: !!userId,
        hasEmail: !!email,
        userId,
        timestamp: new Date().toISOString()
      });
    }
  }, [token, userId, email, isInitialized]);

  // Prevent rendering children until auth is fully initialized
  if (!isInitialized) {
    console.log('⏳ Auth still initializing...');
    return <div>Loading...</div>;
  }

  const contextValue = {
    token,
    userId,
    email,
    isAuthenticated: !!token && !!userId && !!email,
    login,
    logout,
  };

  console.log('🎯 Providing auth context:', {
    isAuthenticated: contextValue.isAuthenticated,
    hasToken: !!token,
    hasUserId: !!userId,
    hasEmail: !!email
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
