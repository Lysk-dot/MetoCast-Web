import { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Search,
  AlertCircle,
  Mic
} from 'lucide-react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import EpisodeForm from './EpisodeForm';

const EpisodeManager = () => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState(null);

  useEffect(() => {
    fetchEpisodes();
  }, []);

  const fetchEpisodes = async () => {
    try {
      setLoading(true);
      const response = await api.getAdminEpisodes();
      setEpisodes(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar episódios:', error);
      toast.error('Erro ao carregar episódios');
      // Dados de exemplo
      setEpisodes([
        {
          id: 1,
          title: 'Aquecimento ENEM',
          description: 'Dicas e motivação para você arrasar no ENEM!',
          status: 'published',
          published_at: '2025-10-15',
          spotify_url: 'https://open.spotify.com/show/1QpRW5ISZzqqJyd3orYxsy',
          youtube_url: 'https://www.youtube.com/@MetoCast',
          tags: ['ENEM', 'Educação'],
        },
        {
          id: 2,
          title: 'Educação Financeira à luz do Conhecimento',
          description: 'Aprenda a gerenciar seu dinheiro enquanto estuda.',
          status: 'published',
          published_at: '2025-09-20',
          spotify_url: 'https://open.spotify.com/show/1QpRW5ISZzqqJyd3orYxsy',
          youtube_url: 'https://www.youtube.com/@MetoCast',
          tags: ['Finanças', 'Educação'],
        },
        {
          id: 3,
          title: 'Nova Temporada - Preview',
          description: 'Um spoiler do que vem por aí na nova temporada!',
          status: 'draft',
          published_at: null,
          spotify_url: '',
          youtube_url: '',
          tags: ['Preview'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await api.publishEpisode(id);
      toast.success('Episódio publicado!');
      fetchEpisodes();
    } catch (error) {
      console.error('Erro ao publicar:', error);
      toast.error('Erro ao publicar episódio');
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await api.unpublishEpisode(id);
      toast.success('Episódio despublicado');
      fetchEpisodes();
    } catch (error) {
      console.error('Erro ao despublicar:', error);
      toast.error('Erro ao despublicar episódio');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este episódio?')) return;
    
    try {
      await api.deleteEpisode(id);
      toast.success('Episódio deletado');
      fetchEpisodes();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      toast.error('Erro ao deletar episódio');
    }
  };

  const handleEdit = (episode) => {
    setEditingEpisode(episode);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEpisode(null);
  };

  const handleFormSave = () => {
    fetchEpisodes();
    handleFormClose();
  };

  const filteredEpisodes = episodes.filter((episode) =>
    episode.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Gerenciar Episódios
          </h1>
          <p className="text-gray-400">
            {episodes.length} episódio(s) cadastrado(s)
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="w-5 h-5" />
          Novo Episódio
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar episódios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-12"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-yellow-primary animate-spin" />
        </div>
      ) : filteredEpisodes.length === 0 ? (
        <div className="text-center py-20 card">
          <Mic className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">
            {searchTerm ? 'Nenhum episódio encontrado' : 'Nenhum episódio cadastrado'}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface border-b border-surface-hover">
                <tr>
                  <th className="text-left text-gray-400 font-medium p-4">Título</th>
                  <th className="text-left text-gray-400 font-medium p-4">Status</th>
                  <th className="text-left text-gray-400 font-medium p-4">Data</th>
                  <th className="text-left text-gray-400 font-medium p-4">Tags</th>
                  <th className="text-right text-gray-400 font-medium p-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-hover">
                {filteredEpisodes.map((episode) => (
                  <tr key={episode.id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-white">{episode.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {episode.description}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      {episode.status === 'published' ? (
                        <span className="badge badge-green">
                          <Eye className="w-3 h-3 mr-1" />
                          Publicado
                        </span>
                      ) : (
                        <span className="badge badge-yellow">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Rascunho
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-400">
                      {formatDate(episode.published_at || episode.created_at)}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {(episode.tags || []).slice(0, 2).map((tag, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded bg-blue-primary/20 text-blue-primary">
                            {tag}
                          </span>
                        ))}
                        {(episode.tags || []).length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{episode.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {episode.status === 'published' ? (
                          <button
                            onClick={() => handleUnpublish(episode.id)}
                            className="p-2 text-gray-400 hover:text-yellow-primary hover:bg-yellow-primary/10 rounded-lg transition-all"
                            title="Despublicar"
                          >
                            <EyeOff className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePublish(episode.id)}
                            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-all"
                            title="Publicar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(episode)}
                          className="p-2 text-gray-400 hover:text-blue-primary hover:bg-blue-primary/10 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(episode.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Deletar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <EpisodeForm
          episode={editingEpisode}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
};

export default EpisodeManager;
