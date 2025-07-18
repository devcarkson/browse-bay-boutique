import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  token: string | null;
  refresh: string | null;
  userId: number | null;
  email: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (token: string, userId: number, email: string, remember: boolean, refresh?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStored(key: string): string | null {
  return localStorage.getItem(key) || sessionStorage.getItem(key);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => getStored("token"));
  const [refresh, setRefresh] = useState<string | null>(() => getStored("refresh"));
  const [userId, setUserId] = useState<number | null>(() => {
    const stored = getStored("userId");
    return stored ? parseInt(stored, 10) : null;
  });
  const [email, setEmail] = useState<string | null>(() => getStored("email"));
  const [isInitialized, setIsInitialized] = useState(false);

  const login = (
    newToken: string, 
    newUserId: number, 
    newEmail: string, 
    remember = true, 
    newRefresh = ""
  ) => {
    const storage = remember ? localStorage : sessionStorage;

    // Clear both storages
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refresh");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("email");

    // Store new data
    storage.setItem("token", newToken);
    storage.setItem("refresh", newRefresh);
    storage.setItem("userId", String(newUserId));
    storage.setItem("email", newEmail);

    setToken(newToken);
    setRefresh(newRefresh);
    setUserId(newUserId);
    setEmail(newEmail);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refresh");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("email");

    setToken(null);
    setRefresh(null);
    setUserId(null);
    setEmail(null);
  };

  useEffect(() => {
    const storedToken = getStored("token");
    const storedRefresh = getStored("refresh");
    const storedUserId = getStored("userId");
    const storedEmail = getStored("email");

    if (storedToken && storedUserId && storedEmail) {
      setToken(storedToken);
      setRefresh(storedRefresh);
      setUserId(parseInt(storedUserId, 10));
      setEmail(storedEmail);
    }
    setIsInitialized(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        refresh,
        userId,
        email,
        isAuthenticated: !!token,
        isInitialized,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}