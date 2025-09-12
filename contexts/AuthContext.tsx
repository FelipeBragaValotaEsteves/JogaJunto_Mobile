import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  userToken: string | null;
  loading: boolean;
  login: (token: string, userId: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  userToken: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) setUserToken(token);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (token: string, userId: string | number) => {
    try {
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userId", String(userId)); 
      setUserToken(token);
    } catch (error) {
      console.error("AuthContext: Erro no login:", error);
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userId");
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
