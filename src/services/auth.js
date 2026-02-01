import { api } from './api';

export const auth = {
  // Login e salvar token
  login: async (email, password) => {
    const response = await api.login(email, password);
    const { access_token } = response.data;
    
    localStorage.setItem('metocast_token', access_token);
    
    // Buscar dados do usuário após login
    try {
      const userResponse = await api.verifyToken();
      const user = userResponse.data;
      localStorage.setItem('metocast_user', JSON.stringify(user));
      return { token: access_token, user };
    } catch (e) {
      // Se não conseguir buscar o usuário, ainda retorna o token
      return { token: access_token, user: { email } };
    }
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem('metocast_token');
    localStorage.removeItem('metocast_user');
  },
  
  // Verificar se está logado
  isAuthenticated: () => {
    return !!localStorage.getItem('metocast_token');
  },
  
  // Obter token
  getToken: () => {
    return localStorage.getItem('metocast_token');
  },
  
  // Obter usuário
  getUser: () => {
    const user = localStorage.getItem('metocast_user');
    return user ? JSON.parse(user) : null;
  },
  
  // Verificar token válido - não faz logout automaticamente
  verifyToken: async () => {
    try {
      const response = await api.verifyToken();
      // Atualiza dados do usuário
      localStorage.setItem('metocast_user', JSON.stringify(response.data));
      return true;
    } catch (error) {
      console.error('Token inválido:', error);
      return false;
    }
  },
};

export default auth;
