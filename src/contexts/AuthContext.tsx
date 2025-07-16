
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

  useEffect(() => {
    const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
    const savedToken = storage.getItem("token");
    const savedUserId = storage.getItem("userId");
    const savedEmail = storage.getItem("email");

    if (savedToken && savedUserId && savedEmail) {
      console.log('Restoring auth state from storage:', { 
        hasToken: !!savedToken, 
        userId: savedUserId, 
        email: savedEmail 
      });
      setToken(savedToken);
      setUserId(Number(savedUserId));
      setEmail(savedEmail);
    }
  }, []);

  const login = (newToken: string, newUserId: number, newEmail: string, remember: boolean) => {
    const storage = remember ? localStorage : sessionStorage;
    console.log('Logging in user:', { userId: newUserId, email: newEmail, remember });
    
    storage.setItem("token", newToken);
    storage.setItem("userId", String(newUserId));
    storage.setItem("email", newEmail);

    setToken(newToken);
    setUserId(newUserId);
    setEmail(newEmail);
  };

  const logout = () => {
    console.log('Logging out user');
    localStorage.clear();
    sessionStorage.clear();
    setToken(null);
    setUserId(null);
    setEmail(null);
  };

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
