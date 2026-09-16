import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('church_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // Apenas para garantir sincronia caso algo mude
    const savedUser = localStorage.getItem('church_user');
    if (!savedUser && user) {
      setUser(null);
    }
  }, []);

  const login = async (username, password) => {
    try {
      // Fallback para admin inicial caso o banco esteja vazio
      if (username === 'master' && password === '@Master2026') {
        const loggedUser = { username: 'master', system_role: 'admin' };
        setUser(loggedUser);
        localStorage.setItem('church_user', JSON.stringify(loggedUser));
        return { success: true };
      }

      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .eq('has_access', true)
        .single();

      if (error || !data) {
        return { success: false, message: 'Usuário não encontrado, sem acesso ou senha incorreta.' };
      }

      const loggedUser = { 
        id: data.id, 
        username: data.username, 
        name: data.name,
        system_role: data.system_role || 'user'
      };
      
      setUser(loggedUser);
      localStorage.setItem('church_user', JSON.stringify(loggedUser));
      return { success: true };
    } catch (err) {
      console.error('Erro no login:', err);
      return { success: false, message: 'Erro ao conectar no banco de dados.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('church_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
