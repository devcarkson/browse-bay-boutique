
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
        console.log('Starting auth state restoration...');
        
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

        console.log('Storage check results:', {
          storageType,
          hasToken: !!savedToken,
          hasUserId: !!savedUserId,
          hasEmail: !!savedEmail,
          tokenLength: savedToken?.length || 0
        });

        // Only set auth state if we have ALL required data
        if (savedToken && savedUserId && savedEmail) {
          console.log('Restoring auth state from', storageType);
          setToken(savedToken);
          setUserId(Number(savedUserId));
          setEmail(savedEmail);
        } else {
          console.log('No complete auth state found - missing data:', {
            token: !savedToken ? 'missing' : 'present',
            userId: !savedUserId ? 'missing' : 'present',
            email: !savedEmail ? 'missing' : 'present'
          });
          // Don't clear anything here - just leave state as null
        }
      } catch (error) {
        console.error('Error restoring auth state:', error);
        // Don't clear state on error - just log it
      } finally {
        setIsInitialized(true);
        console.log('Auth initialization complete');
      }
    };

    restoreAuthState();
  }, []);

  const login = (newToken: string, newUserId: number, newEmail: string, remember: boolean) => {
    try {
      const storage = remember ? localStorage : sessionStorage;
      console.log('Logging in user:', { 
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

      // Update state
      setToken(newToken);
      setUserId(newUserId);
      setEmail(newEmail);
      
      console.log('Login successful - auth state updated');
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = () => {
    try {
      console.log('Manually logging out user');
      
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
      
      console.log('Logout complete');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Log auth state changes for debugging
  useEffect(() => {
    if (isInitialized) {
      console.log('Auth state changed:', {
        isAuthenticated: !!token,
        hasToken: !!token,
        hasUserId: !!userId,
        hasEmail: !!email,
        userId
      });
    }
  }, [token, userId, email, isInitialized]);

  // Don't render children until auth state is initialized
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        email,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
