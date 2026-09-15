import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LiveProvider } from './context/LiveContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Login from './pages/Login';
import PublicRegister from './pages/PublicRegister';
import Financial from './pages/Financial';
import Studies from './pages/Studies';
import Bible from './pages/Bible';
import Tasks from './pages/Tasks';
import LiveService from './pages/LiveService';
import PreacherPanel from './pages/PreacherPanel';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <LiveProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<PublicRegister />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="membros" element={<Members />} />
              <Route path="financeiro" element={<Financial />} />
              <Route path="estudos" element={<Studies />} />
              <Route path="tarefas" element={<Tasks />} />
              <Route path="biblia" element={<Bible />} />
              <Route path="culto" element={<LiveService />} />
              <Route path="preletor" element={<PreacherPanel />} />
            </Route>
          </Routes>
        </Router>
      </LiveProvider>
    </AuthProvider>
  );
}

export default App;
