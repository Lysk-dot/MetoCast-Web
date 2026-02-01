import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Headphones, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirecionar se já estiver logado
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await login(formData.email, formData.password);
      toast.success('Login realizado com sucesso!');
      navigate('/admin');
    } catch (err) {
      console.error('Erro no login:', err);
      setError(err.response?.data?.message || 'Credenciais inválidas');
      toast.error('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface-dark relative overflow-hidden" style={{ backgroundColor: '#0D0D0F', minHeight: '100vh' }}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-primary/10 via-transparent to-blue-primary/10" />
      
      {/* Decorative circles */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-primary/10 rounded-full blur-3xl" />

      {/* Card de login */}
      <div className="relative w-full max-w-md">
        <div className="card p-8 bg-surface-card/90 backdrop-blur-xl border border-surface-hover">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-primary to-yellow-dark flex items-center justify-center shadow-lg shadow-yellow-primary/20">
                <Headphones className="w-7 h-7 text-blue-primary" />
              </div>
            </Link>
            <h1 className="font-heading text-2xl font-bold text-white mb-2">
              Painel <span className="text-yellow-primary">MetoCast</span>
            </h1>
            <p className="text-gray-500">
              Faça login para acessar o painel administrativo
            </p>
          </div>

          {/* Erro */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="input-field pl-12"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-12"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Link para voltar */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-gray-500 text-sm hover:text-yellow-primary transition-colors"
            >
              ← Voltar para o site
            </Link>
          </div>
        </div>

        {/* Nota de demo */}
        <p className="text-center text-gray-600 text-xs mt-6">
          Área restrita para administradores do MetoCast
        </p>
      </div>
    </div>
  );
};

export default Login;
