"use client"

import API from "@/utils/axios";
import { createContext, useState, useEffect } from "react";

interface AuthContextType {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  loading: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

interface UserType {
  id: string;
  username: string;
  role: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserType | null>(null); 
  const [loading, setLoading] = useState<boolean>(true);

  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.post("/account/info");
        console.log(res.data.username)
        setUser(res.data);
      } catch (err: any) {
        console.log(err?.response?.data?.message)
        setUser({ id: "", username: "", role: "" });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
