"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/services/api";

export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  status: string;
  last_login: string;
  created_at: string;
  updated_at: string;
}

export interface FitcoinAccount {
  id: number;
  colaborator_id: number;
  balance: number;
  streak_count?: number;
  last_activity_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Collaborator {
  id: number;
  user_id: number;
  nombre: string;
  sexo: string;
  telefono: string;
  direccion: string;
  ocupacion: string;
  area: string;
  peso: string;
  altura: string;
  tipo_sangre: string;
  alergias: string;
  padecimientos: string;
  indice_masa_corporal: string;
  nivel_asignado: string;
  photo_path: string | null;
  photo_url: string | null;
  coin_fits: number;
  IMC_objetivo?: string;
  peso_objetivo?: string;
  created_at: string;
  updated_at: string;
  user: User;
  fitcoin_account: FitcoinAccount;
}

export interface LoginResponse {
  user: User;
  token: string;
}

type AuthContextData = {
  user: User | null;
  collaborator: Collaborator | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({
  user: null,
  collaborator: null,
  token: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  refreshData: async () => {},
});

export const WebAuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [collaborator, setCollaborator] = useState<Collaborator | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCollaborator = async () => {
    try {
      const { data } = await api.get<{ collaborator: Collaborator }>("/app/collaborator");
      setCollaborator(data.collaborator);
    } catch {
      setCollaborator(null);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const resUser = await api.get<{ user: User }>("/app/user");
      setUser(resUser.data.user);
      await loadCollaborator();
    } finally {
      setLoading(false);
    }
  };

  // Al montar, si hay token en localStorage, lo usamos
  useEffect(() => {
    (async () => {
      try {
        const t = localStorage.getItem("auth_token");
        if (t) {
          setToken(t);
          // tu interceptor ya lo inyecta desde localStorage, pero aseguramos:
          api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
          await refreshData();
        }
      } catch (e) {
        console.error("Auth init error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post<LoginResponse>("/app/login", { email, password });
      const { user: u, token: t } = res.data;

      localStorage.setItem("auth_token", t);
      api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
      setToken(t);
      setUser(u);

      await loadCollaborator();
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/app/logout");
    } catch {
      // ignorar fallos del backend aquí
    }
    localStorage.removeItem("auth_token");
    delete api.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
    setCollaborator(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        collaborator,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
        refreshData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useWebAuth = () => useContext(AuthContext);
