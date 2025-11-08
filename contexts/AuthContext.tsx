import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  userToken: string | null;
  userName: string | null;
  loading: boolean;
  login: (token: string, userId: string, userName: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  userToken: null,
  userName: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const name = await AsyncStorage.getItem("userName");
        if (token) setUserToken(token);
        if (name) setUserName(name);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (token: string, userId: string | number, userName: string) => {
    try {
      
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userId", String(userId)); 
      await AsyncStorage.setItem("userName", userName);
      setUserToken(token);
      setUserName(userName);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("userName");
    setUserToken(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, userName, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
