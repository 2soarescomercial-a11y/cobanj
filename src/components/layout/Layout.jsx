import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, Users, DollarSign, BookOpen, CheckSquare, Book, Mic } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '250px', backgroundColor: '#111827', color: 'white', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>COBANJ</h2>
        <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '2rem' }}>Logado como: {user?.username}</p>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <NavLink to="/" style={{ color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.375rem', textDecoration: 'none' }}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/membros" style={{ color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.375rem', textDecoration: 'none' }}>
            <Users size={20} /> Membros
          </NavLink>
          <NavLink to="/financeiro" style={{ color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.375rem', textDecoration: 'none' }}>
            <DollarSign size={20} /> Financeiro
          </NavLink>
          <NavLink to="/estudos" style={{ color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.375rem', textDecoration: 'none' }}>
            <BookOpen size={20} /> Escola & Estudos
          </NavLink>
          <NavLink to="/biblia" style={{ color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.375rem', textDecoration: 'none' }}>
            <Book size={20} /> Bíblia
          </NavLink>
          <NavLink to="/tarefas" style={{ color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.375rem', textDecoration: 'none' }}>
            <CheckSquare size={20} /> Tarefas
          </NavLink>
          <NavLink to="/preletor" style={{ color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.375rem', textDecoration: 'none' }}>
            <Mic size={20} /> Meu Sermão
          </NavLink>
          <NavLink to="/culto" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.375rem', textDecoration: 'none', color: '#EF4444', backgroundColor: '#FEF2F2', fontWeight: 'bold' }}>
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
      <main style={{ flex: 1, padding: '2rem', backgroundColor: 'var(--color-background)' }}>
        <Outlet />
      </main>
    </div>
  );
}
