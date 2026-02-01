import axios from 'axios';

// Usa Railway em produção, localhost em desenvolvimento
const API_BASE = import.meta.env.PROD 
  ? 'https://metocast-production.up.railway.app/api'
  : 'http://localhost:8000/api';

// Criar instância do axios com configurações base
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('metocast_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('metocast_token');
      window.location.hash = '#/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // ============ PÚBLICO ============
  
  // Buscar episódios publicados
  getEpisodes: () => apiClient.get('/episodes'),
  
  // Buscar episódio por ID
  getEpisode: (id) => apiClient.get(`/episodes/${id}`),
  
  // Buscar links oficiais
  getLinks: () => apiClient.get('/links'),
  
  // ============ AUTENTICAÇÃO ============
  
  // Login
  login: (email, password) => 
    apiClient.post('/auth/login', { email, password }),
  
  // Verificar token
  verifyToken: () => apiClient.get('/auth/me'),
  
  // ============ ADMIN - EPISÓDIOS ============
  
  // Buscar todos os episódios (incluindo rascunhos)
  getAdminEpisodes: () => apiClient.get('/admin/episodes'),
  
  // Criar episódio
  createEpisode: (data) => apiClient.post('/admin/episodes', data),
  
  // Atualizar episódio
  updateEpisode: (id, data) => apiClient.put(`/admin/episodes/${id}`, data),
  
  // Deletar episódio
  deleteEpisode: (id) => apiClient.delete(`/admin/episodes/${id}`),
  
  // Publicar episódio
  publishEpisode: (id) => apiClient.patch(`/admin/episodes/${id}/publish`),
  
  // Despublicar episódio
  unpublishEpisode: (id) => apiClient.patch(`/admin/episodes/${id}/unpublish`),
  
  // ============ ADMIN - LINKS ============
  
  // Buscar todos os links (admin)
  getAdminLinks: () => apiClient.get('/admin/links'),
  
  // Criar link
  createLink: (data) => apiClient.post('/admin/links', data),
  
  // Atualizar link
  updateLink: (id, data) => apiClient.put(`/admin/links/${id}`, data),
  
  // Deletar link
  deleteLink: (id) => apiClient.delete(`/admin/links/${id}`),
  
  // Reordenar links
  reorderLinks: (ids) => apiClient.patch('/admin/links/reorder', { ids }),
};

export default api;
