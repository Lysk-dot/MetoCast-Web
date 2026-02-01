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
      setEpisodes([]);
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

  // Converter tags string para array se necessário
  const getTags = (tags) => {
    if (!tags) return [];
    if (typeof tags === 'string') return tags.split(',').map(t => t.trim());
    return tags;
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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar episódios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-12"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && episodes.length === 0 && (
        <div className="text-center py-12">
          <Mic className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Nenhum episódio cadastrado
          </h3>
          <p className="text-gray-400 mb-6">
            Comece adicionando seu primeiro episódio!
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Criar Primeiro Episódio
          </button>
        </div>
      )}

      {/* Episodes Grid */}
      {!loading && filteredEpisodes.length > 0 && (
        <div className="grid gap-4">
          {filteredEpisodes.map((episode) => (
            <div
              key={episode.id}
              className="bg-surface-card border border-surface-hover rounded-xl p-4 hover:border-primary/50 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Thumbnail */}
                <div className="w-full md:w-32 h-20 bg-surface rounded-lg overflow-hidden flex-shrink-0">
                  {episode.cover_image_url ? (
                    <img
                      src={episode.cover_image_url}
                      alt={episode.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <Mic className="w-8 h-8 text-primary" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-white truncate">
                      {episode.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                        episode.status === 'PUBLISHED'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {episode.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {episode.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {getTags(episode.tags).slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs bg-surface rounded-full text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="text-xs text-gray-500">
                      {formatDate(episode.created_at)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {episode.status === 'PUBLISHED' ? (
                    <button
                      onClick={() => handleUnpublish(episode.id)}
                      className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-all"
                      title="Despublicar"
                    >
                      <EyeOff className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePublish(episode.id)}
                      className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-all"
                      title="Publicar"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(episode)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    title="Editar"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(episode.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    title="Deletar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Episode Form Modal */}
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
