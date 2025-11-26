import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = () => {
      try {
        const storedUser = localStorage.getItem('traccar_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Erro ao restaurar sessão", error);
        localStorage.removeItem('traccar_user');
        localStorage.removeItem('traccar_auth_token');
      } finally {
        setLoadingSession(false);
      }
    };
    verifySession();
  }, []);

  const login = (userData) => {
    localStorage.setItem('traccar_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('traccar_user');
    localStorage.removeItem('traccar_auth_token');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loadingSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};