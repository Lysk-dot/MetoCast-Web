import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log('[AuthProvider] Render - loading:', loading, 'isAuth:', isAuthenticated);

  useEffect(() => {
    // Verificar autenticação ao carregar
    const checkAuth = async () => {
      try {
        console.log('[AuthContext] Verificando autenticação...');
        if (auth.isAuthenticated()) {
          console.log('[AuthContext] Token encontrado, verificando validade...');
          const isValid = await auth.verifyToken();
          if (isValid) {
            console.log('[AuthContext] Token válido, usuário autenticado');
            setUser(auth.getUser());
            setIsAuthenticated(true);
          } else {
            console.log('[AuthContext] Token inválido');
          }
        } else {
          console.log('[AuthContext] Nenhum token encontrado');
        }
      } catch (error) {
        console.error('[AuthContext] Erro ao verificar autenticação:', error);
      } finally {
        console.log('[AuthContext] Verificação concluída, setando loading=false');
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const { user } = await auth.login(email, password);
    setUser(user);
    setIsAuthenticated(true);
    return user;
  };

  const logout = () => {
    auth.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  // Se estiver carregando, não renderiza nada ainda para evitar flash
  if (loading) {
    return (
      <AuthContext.Provider value={value}>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D0D0F' }}>
          <div className="text-center">
            <div className="spinner mx-auto mb-4" style={{ borderColor: '#FFC107', borderTopColor: 'transparent' }}></div>
            <p style={{ color: '#B0B0B8' }}>Carregando...</p>
          </div>
        </div>
      </AuthContext.Provider>
    );  
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;
