
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
        // Check localStorage first, then sessionStorage
        let storage = localStorage;
        let savedToken = localStorage.getItem("token");
        let savedUserId = localStorage.getItem("userId");
        let savedEmail = localStorage.getItem("email");

        // If not in localStorage, check sessionStorage
        if (!savedToken) {
          storage = sessionStorage;
          savedToken = sessionStorage.getItem("token");
          savedUserId = sessionStorage.getItem("userId");
          savedEmail = sessionStorage.getItem("email");
        }

        if (savedToken && savedUserId && savedEmail) {
          console.log('Restoring auth state from storage:', { 
            storageType: storage === localStorage ? 'localStorage' : 'sessionStorage',
            hasToken: !!savedToken, 
            userId: savedUserId, 
            email: savedEmail 
          });
          setToken(savedToken);
          setUserId(Number(savedUserId));
          setEmail(savedEmail);
        } else {
          console.log('No valid auth state found in storage');
        }
      } catch (error) {
        console.error('Error restoring auth state:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    restoreAuthState();
  }, []);

  const login = (newToken: string, newUserId: number, newEmail: string, remember: boolean) => {
    try {
      const storage = remember ? localStorage : sessionStorage;
      console.log('Logging in user:', { userId: newUserId, email: newEmail, remember });
      
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

      setToken(newToken);
      setUserId(newUserId);
      setEmail(newEmail);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = () => {
    try {
      console.log('Logging out user');
      
      // Clear all auth data from both storages
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("email");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("email");
      
      // Don't clear other data that might be important
      // localStorage.clear();
      // sessionStorage.clear();
      
      setToken(null);
      setUserId(null);
      setEmail(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

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
