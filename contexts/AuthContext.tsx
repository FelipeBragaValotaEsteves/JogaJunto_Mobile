import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

type AuthContextType = {
  userToken: string | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
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

  const login = async (token: string) => {
    await AsyncStorage.setItem("userToken", token);
    setUserToken(token);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("userToken");
    setUserToken(null);
    Alert.alert("Sessão finalizada");
  };

  return (
    <AuthContext.Provider value={{ userToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
