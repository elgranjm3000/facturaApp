import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { storageService } from '../services/storageService';

interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rif: string;
  empresa: string;
  logo: string;
}

interface LoginContextType {
  isAuthenticated: boolean;
  usuario: Usuario | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  registrar: (datos: any) => Promise<void>;
  logout: () => void;
  limpiarError: () => void;
  actualizarPerfil: (datos: any) => Promise<void>;
  cambiarPassword: (passwordActual: string, passwordNueva: string) => Promise<void>;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const usuarioAutenticado = storageService.login(email, password);
      localStorage.setItem('token', `token_${usuarioAutenticado.id}`);
      localStorage.setItem('usuario', JSON.stringify(usuarioAutenticado));
      setUsuario(usuarioAutenticado);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Registrar
  const registrar = async (datos: any) => {
    setLoading(true);
    setError(null);
    try {
      const nuevoUsuario = storageService.registrarUsuario(datos);
      localStorage.setItem('token', `token_${nuevoUsuario.id}`);
      localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
      setUsuario(nuevoUsuario);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Error al registrar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Limpiar error
  const limpiarError = () => {
    setError(null);
  };

  // Actualizar perfil
  const actualizarPerfil = async (datos: any) => {
    setLoading(true);
    setError(null);
    try {
      if (usuario) {
        storageService.actualizarUsuario(usuario.id, datos);
        const usuarioActualizado = { ...usuario, ...datos };
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
        setUsuario(usuarioActualizado);
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cambiar contraseña
  const cambiarPassword = async (passwordActual: string, passwordNueva: string) => {
    setLoading(true);
    setError(null);
    try {
      if (usuario) {
        storageService.cambiarPassword(usuario.email, passwordActual, passwordNueva);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cambiar contraseña');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verificar sesión al cargar
  useEffect(() => {
    const savedUsuario = localStorage.getItem('usuario');
    const savedToken = localStorage.getItem('token');

    if (savedUsuario && savedToken) {
      try {
        const usuarioData = JSON.parse(savedUsuario);
        setUsuario(usuarioData);
        setIsAuthenticated(true);
      } catch (err) {
        logout();
      }
    }
  }, []);

  return (
    <LoginContext.Provider
      value={{
        isAuthenticated,
        usuario,
        loading,
        error,
        login,
        registrar,
        logout,
        limpiarError,
        actualizarPerfil,
        cambiarPassword,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error('useLogin debe usarse dentro de LoginProvider');
  }
  return context;
};