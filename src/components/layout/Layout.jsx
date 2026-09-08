import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '250px', backgroundColor: '#111827', color: 'white', padding: '1rem' }}>
        <h2>Church App</h2>
        <nav style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <a href="/" style={{ color: 'white' }}>Dashboard</a>
          <a href="/membros" style={{ color: 'white' }}>Membros</a>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
