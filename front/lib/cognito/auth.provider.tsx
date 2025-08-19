import { AuthContextType, AuthSession } from "@/lib/cognito/utils/auth.types";
import {
  clearSessionFromStorage,
  loadSessionFromStorage,
  saveSessionToStorage,
} from "@/lib/cognito/utils/auth.utils";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session from storage on app start
  const handleLoadSession = async () => {
    setIsLoading(true);
    const session = await loadSessionFromStorage();
    if (session) {
      setSession(session);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleLoadSession();
  }, []);

  const saveUserSession = async (session: AuthSession) => {
    setSession(session);
    await saveSessionToStorage(session);
  };

  const signOut = async () => {
    setSession(null);
    await clearSessionFromStorage();
  };

  const updateSession = async (updates: Partial<AuthSession>) => {
    const updatedSession = { ...session, ...updates };
    await saveUserSession(updatedSession);
  };

  const isAuthenticated = !!session?.accessToken;

  const value: AuthContextType = {
    session,
    isLoading,
    isAuthenticated,
    signOut,
    updateSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, useAuth };
