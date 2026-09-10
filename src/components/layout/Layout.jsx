import { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, Users, DollarSign, BookOpen, CheckSquare, Book, Mic, Menu, X } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="layout-container">
      {/* Botão Hamburger para Mobile */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#111827', color: 'white' }} className="mobile-header d-md-none">
        <h2 style={{ color: 'var(--color-primary)', margin: 0 }}>COBANJ</h2>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ color: 'white' }}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay Escuro para fechar clicando fora */}
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={closeMenu}
      ></div>

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h2 style={{ color: 'var(--color-primary)' }}>COBANJ</h2>
          <button onClick={closeMenu} style={{ color: 'white' }} className="d-md-none">
            <X size={24} />
          </button>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '2rem' }}>Logado como: {user?.username}</p>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <NavLink to="/" onClick={closeMenu} style={{ color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.375rem', textDecoration: 'none' }}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/membros" onClick={closeMenu} style={{ color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.375rem', textDecoration: 'none' }}>
            <Users size={20} /> Membros
          </NavLink>
          <NavLink to="/financeiro" onClick={closeMenu} style={{ color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.375rem', textDecoration: 'none' }}>
            <DollarSign size={20} /> Financeiro
          </NavLink>
          <NavLink to="/estudos" onClick={closeMenu} style={{ color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.375rem', textDecoration: 'none' }}>
            <BookOpen size={20} /> Escola & Estudos
          </NavLink>
          <NavLink to="/biblia" onClick={closeMenu} style={{ color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.375rem', textDecoration: 'none' }}>
            <Book size={20} /> Bíblia
          </NavLink>
          <NavLink to="/tarefas" onClick={closeMenu} style={{ color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.375rem', textDecoration: 'none' }}>
            <CheckSquare size={20} /> Tarefas
          </NavLink>
          <NavLink to="/preletor" onClick={closeMenu} style={{ color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.375rem', textDecoration: 'none' }}>
            <Mic size={20} /> Meu Sermão
          </NavLink>
          <NavLink to="/culto" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.375rem', textDecoration: 'none', color: '#EF4444', backgroundColor: '#FEF2F2', fontWeight: 'bold' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%' }} className="animate-pulse"></span> Ao Vivo
          </NavLink>
        </nav>

        <button 
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FCA5A5', padding: '0.75rem', marginTop: 'auto' }}
        >
          <LogOut size={20} /> Sair
        </button>
      </aside>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
