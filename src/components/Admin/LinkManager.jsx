import { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Search,
  Link as LinkIcon,
  ExternalLink,
  GripVertical
} from 'lucide-react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

const LinkManager = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  
  const [formData, setFormData] = useState({
    label: '',
    url: '',
    type: 'other',
    order: 0,
  });

  const linkTypes = [
    { value: 'spotify', label: 'Spotify', color: 'spotify' },
    { value: 'youtube', label: 'YouTube', color: 'youtube' },
    { value: 'instagram', label: 'Instagram', color: 'instagram' },
    { value: 'website', label: 'Website', color: 'blue-primary' },
    { value: 'other', label: 'Outro', color: 'gray-400' },
  ];

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await api.getAdminLinks();
      setLinks(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar links:', error);
      // Dados de exemplo
      setLinks([
        { id: 1, label: 'Spotify', url: 'https://open.spotify.com/show/1QpRW5ISZzqqJyd3orYxsy', type: 'spotify', order: 1 },
        { id: 2, label: 'YouTube', url: 'https://www.youtube.com/@MetoCast', type: 'youtube', order: 2 },
        { id: 3, label: 'Instagram', url: 'https://www.instagram.com/meto_cast/', type: 'instagram', order: 3 },
        { id: 4, label: 'Metodista', url: 'https://www.metodista.br', type: 'website', order: 4 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.label.trim() || !formData.url.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      if (editingLink) {
        await api.updateLink(editingLink.id, formData);
        toast.success('Link atualizado!');
      } else {
        await api.createLink(formData);
        toast.success('Link criado!');
      }
      
      fetchLinks();
      handleCloseForm();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar link');
    }
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setFormData({
      label: link.label,
      url: link.url,
      type: link.type,
      order: link.order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este link?')) return;
    
    try {
      await api.deleteLink(id);
      toast.success('Link deletado');
      fetchLinks();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      toast.error('Erro ao deletar link');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingLink(null);
    setFormData({
      label: '',
      url: '',
      type: 'other',
      order: 0,
    });
  };

  const getTypeColor = (type) => {
    const found = linkTypes.find((t) => t.value === type);
    return found ? found.color : 'gray-400';
  };

  const getTypeLabel = (type) => {
    const found = linkTypes.find((t) => t.value === type);
    return found ? found.label : 'Outro';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Gerenciar Links
          </h1>
          <p className="text-gray-400">
            {links.length} link(s) cadastrado(s)
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="w-5 h-5" />
          Novo Link
        </button>
      </div>

      {/* Links List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-yellow-primary animate-spin" />
        </div>
      ) : links.length === 0 ? (
        <div className="text-center py-20 card">
          <LinkIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Nenhum link cadastrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {links.sort((a, b) => a.order - b.order).map((link) => (
            <div
              key={link.id}
              className="card flex items-center gap-4 p-4"
            >
              <div className="text-gray-500 cursor-grab">
                <GripVertical className="w-5 h-5" />
              </div>
              
              <div className={`w-3 h-3 rounded-full bg-${getTypeColor(link.type)}`} />
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white">{link.label}</p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-blue-primary truncate block"
                >
                  {link.url}
                </a>
              </div>
              
              <span className={`badge bg-${getTypeColor(link.type)}/20 text-${getTypeColor(link.type)}`}>
                {getTypeLabel(link.type)}
              </span>
              
              <div className="flex items-center gap-2">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-blue-primary hover:bg-blue-primary/10 rounded-lg transition-all"
                  title="Abrir link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleEdit(link)}
                  className="p-2 text-gray-400 hover:text-yellow-primary hover:bg-yellow-primary/10 rounded-lg transition-all"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Deletar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface-card rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-hover">
              <h2 className="font-heading text-xl font-bold text-white">
                {editingLink ? 'Editar Link' : 'Novo Link'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="p-2 text-gray-400 hover:text-white hover:bg-surface-hover rounded-lg transition-all"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome / Label *
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Ex: Spotify"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input-field"
                >
                  {linkTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ordem
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="input-field"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingLink ? 'Salvar' : 'Criar Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkManager;
