import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  
  console.log('[ProtectedRoute] loading:', loading, 'isAuth:', isAuthenticated);
  
  // Marcar como montado
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Redirecionar para login se não autenticado (após loading e montagem)
  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      console.log('[ProtectedRoute] Não autenticado, redirecionando para /login');
      navigate('/login', { replace: true });
    }
  }, [mounted, loading, isAuthenticated, navigate]);
  
  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D0D0F' }}>
        <div className="text-center">
          <div className="spinner mx-auto mb-4" style={{ borderColor: '#FFC107', borderTopColor: 'transparent', width: '40px', height: '40px' }}></div>
          <p style={{ color: '#B0B0B8' }}>Verificando acesso...</p>
        </div>
      </div>
    );
  }
  
  // Se não está autenticado, não renderiza nada (o useEffect já está redirecionando)
  if (!isAuthenticated) {
    return null;
  }
  
  return children;
};

// Componente para redirecionar 404
const NotFoundRedirect = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (mounted) {
      navigate('/', { replace: true });
    }
  }, [mounted, navigate]);
  
  return null;
};

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          {/* Redirecionar rotas não encontradas */}
          <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
      </HashRouter>
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1E1E24',
            color: '#FAFAFA',
            border: '1px solid #2A2A32',
          },
          success: {
            iconTheme: {
              primary: '#1DB954',
              secondary: '#FAFAFA',
            },
          },
          error: {
            iconTheme: {
              primary: '#FF0000',
              secondary: '#FAFAFA',
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
