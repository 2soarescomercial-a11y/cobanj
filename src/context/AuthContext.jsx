import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verifica se há sessão salva ao carregar a página
    const savedUser = localStorage.getItem('church_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username, password) => {
    // Lógica provisória (hardcoded) conforme solicitado
    if (username === 'master' && password === '@Master2026') {
      const loggedUser = { username: 'master', role: 'pastor' };
      setUser(loggedUser);
      localStorage.setItem('church_user', JSON.stringify(loggedUser));
      return { success: true };
    }
    return { success: false, message: 'Usuário ou senha incorretos' };
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
