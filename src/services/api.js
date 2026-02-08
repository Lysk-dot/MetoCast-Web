import axios from 'axios';


// Usar variável de ambiente com fallback
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const ENV = import.meta.env.VITE_ENV || 'development';

console.log('🚀 MetôCast Web - Configuração:');
console.log('  - API Base URL:', API_BASE);
console.log('  - Ambiente:', ENV);

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
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const api = {
  // ============ PÚBLICO ============
  getEpisodes: () => apiClient.get('/episodes'),
  getEpisode: (id) => apiClient.get(`/episodes/${id}`),
  getLinks: () => apiClient.get('/links'),
  
  // ============ AUTENTICAÇÃO ============
  login: (email, password) => 
    apiClient.post('/auth/login', { email, password }),
  verifyToken: () => apiClient.get('/auth/me'),
  
  // ============ ADMIN - EPISÓDIOS ============
  getAdminEpisodes: () => apiClient.get('/admin/episodes'),
  createEpisode: (data) => apiClient.post('/admin/episodes', data),
  updateEpisode: (id, data) => apiClient.put(`/admin/episodes/${id}`, data),
  deleteEpisode: (id) => apiClient.delete(`/admin/episodes/${id}`),
  publishEpisode: (id) => apiClient.patch(`/admin/episodes/${id}/publish`),
  unpublishEpisode: (id) => apiClient.patch(`/admin/episodes/${id}/unpublish`),
  
  // ============ ADMIN - LINKS ============
  getAdminLinks: () => apiClient.get('/admin/links'),
  createLink: (data) => apiClient.post('/admin/links', data),
  updateLink: (id, data) => apiClient.put(`/admin/links/${id}`, data),
  deleteLink: (id) => apiClient.delete(`/admin/links/${id}`),
  reorderLinks: (ids) => apiClient.patch('/admin/links/reorder', { ids }),
};

export default api;
