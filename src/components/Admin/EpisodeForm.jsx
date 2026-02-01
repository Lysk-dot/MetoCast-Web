import { useState, useEffect } from 'react';
import { X, Save, Loader2, Image, Link, Tag } from 'lucide-react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

const EpisodeForm = ({ episode, onClose, onSave }) => {
  const isEditing = !!episode;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail_url: '',
    spotify_url: '',
    youtube_url: '',
    tags: '',
    status: 'draft',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (episode) {
      setFormData({
        title: episode.title || '',
        description: episode.description || '',
        thumbnail_url: episode.thumbnail_url || '',
        spotify_url: episode.spotify_url || '',
        youtube_url: episode.youtube_url || '',
        tags: Array.isArray(episode.tags) ? episode.tags.join(', ') : '',
        status: episode.status || 'draft',
      });
    }
  }, [episode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      setLoading(true);
      
      const data = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };
      
      if (isEditing) {
        await api.updateEpisode(episode.id, data);
        toast.success('Episódio atualizado!');
      } else {
        await api.createEpisode(data);
        toast.success('Episódio criado!');
      }
      
      onSave();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error(isEditing ? 'Erro ao atualizar' : 'Erro ao criar episódio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface-card rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-surface-hover bg-surface-card z-10">
          <h2 className="font-heading text-xl font-bold text-white">
            {isEditing ? 'Editar Episódio' : 'Novo Episódio'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-surface-hover rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Aquecimento ENEM"
              className={`input-field ${errors.title ? 'border-red-500' : ''}`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-400">{errors.title}</p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva o episódio..."
              rows={4}
              className={`input-field resize-none ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description}</p>
            )}
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Image className="w-4 h-4 inline mr-2" />
              URL da Imagem (opcional)
            </label>
            <input
              type="url"
              name="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={handleChange}
              placeholder="https://exemplo.com/imagem.jpg"
              className="input-field"
            />
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <span className="text-spotify">●</span> URL Spotify
              </label>
              <input
                type="url"
                name="spotify_url"
                value={formData.spotify_url}
                onChange={handleChange}
                placeholder="https://open.spotify.com/..."
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <span className="text-youtube">●</span> URL YouTube
              </label>
              <input
                type="url"
                name="youtube_url"
                value={formData.youtube_url}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
                className="input-field"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Tag className="w-4 h-4 inline mr-2" />
              Tags (separadas por vírgula)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Educação, ENEM, Carreira"
              className="input-field"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field"
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>

          {/* Preview */}
          {formData.thumbnail_url && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preview da Imagem
              </label>
              <div className="aspect-video rounded-xl overflow-hidden bg-surface">
                <img
                  src={formData.thumbnail_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-hover">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isEditing ? 'Salvar Alterações' : 'Criar Episódio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EpisodeForm;
