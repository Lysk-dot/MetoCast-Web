import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('episodes');

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado');
    navigate('/login');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#0D0D0F',
      color: 'white',
    },
    header: {
      backgroundColor: '#1A1A1F',
      borderBottom: '1px solid #2A2A32',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      flexWrap: 'wrap',
      gap: '16px',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      textDecoration: 'none',
      color: 'white',
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#1B4B8A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    logoText: {
      fontWeight: 700,
      fontSize: '20px',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap',
    },
    userInfo: {
      textAlign: 'right',
    },
    userName: {
      fontWeight: 600,
      fontSize: '14px',
    },
    userEmail: {
      fontSize: '12px',
      color: '#9CA3AF',
    },
    logoutBtn: {
      padding: '8px 16px',
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      color: '#EF4444',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    main: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '24px 16px',
    },
    tabs: {
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
      backgroundColor: '#1A1A1F',
      padding: '8px',
      borderRadius: '12px',
      flexWrap: 'wrap',
    },
    tab: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s',
      flex: 1,
      justifyContent: 'center',
      minWidth: '140px',
    },
    tabActive: {
      backgroundColor: '#FFC107',
      color: '#0D0D0F',
    },
    tabInactive: {
      backgroundColor: 'transparent',
      color: '#9CA3AF',
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: '#9CA3AF',
      textDecoration: 'none',
      marginBottom: '16px',
      fontSize: '14px',
    },
    content: {
      backgroundColor: '#1A1A1F',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #2A2A32',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <Link to="/" style={styles.logo}>
          <div style={styles.logoIcon}>
            <img 
              src={import.meta.env.BASE_URL + 'images/logo-metocast.png'} 
              alt="MetoCast"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <span style={styles.logoText}>
            Meto<span style={{ color: '#FFC107' }}>Cast</span>
            <span style={{ fontSize: '12px', color: '#9CA3AF', marginLeft: '8px' }}>Admin</span>
          </span>
        </Link>

        <div style={styles.headerRight}>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user?.name || 'Administrador'}</div>
            <div style={styles.userEmail}>{user?.email || 'admin@metocast.com'}</div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            🚪 Sair
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={styles.main}>
        {/* Link voltar */}
        <Link to="/" style={styles.backLink}>
          ← Voltar ao site
        </Link>

        {/* Tabs de navegação */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('episodes')}
            style={{
              ...styles.tab,
              ...(activeTab === 'episodes' ? styles.tabActive : styles.tabInactive),
            }}
          >
            🎙️ Episódios
          </button>
          <button
            onClick={() => setActiveTab('links')}
            style={{
              ...styles.tab,
              ...(activeTab === 'links' ? styles.tabActive : styles.tabInactive),
            }}
          >
            🔗 Links
          </button>
        </div>

        {/* Conteúdo */}
        <div style={styles.content}>
          {activeTab === 'episodes' && <EpisodeManager />}
          {activeTab === 'links' && <LinkManager />}
        </div>
      </main>
    </div>
  );
};

// ========== GERENCIADOR DE EPISÓDIOS ==========
const EpisodeManager = () => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState(null);

  useEffect(() => {
    fetchEpisodes();
  }, []);

  const fetchEpisodes = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/episodes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('metocast_token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEpisodes(data);
      }
    } catch (error) {
      console.error('Erro ao carregar episódios:', error);
    }
    setLoading(false);
  };

  const handleEdit = (episode) => {
    setEditingEpisode(episode);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este episódio?')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/admin/episodes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('metocast_token')}`,
        },
      });
      if (response.ok) {
        setEpisodes(episodes.filter(ep => ep.id !== id));
        toast.success('Episódio excluído!');
      }
    } catch (error) {
      toast.error('Erro ao excluir episódio');
    }
  };

  const handleSave = async (episodeData) => {
    try {
      const url = editingEpisode 
        ? `http://localhost:8000/api/admin/episodes/${editingEpisode.id}`
        : 'http://localhost:8000/api/admin/episodes';
      
      const response = await fetch(url, {
        method: editingEpisode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('metocast_token')}`,
        },
        body: JSON.stringify(episodeData),
      });

      if (response.ok) {
        const saved = await response.json();
        if (editingEpisode) {
          setEpisodes(episodes.map(ep => ep.id === saved.id ? saved : ep));
        } else {
          setEpisodes([saved, ...episodes]);
        }
        setShowForm(false);
        setEditingEpisode(null);
        toast.success(editingEpisode ? 'Episódio atualizado!' : 'Episódio criado!');
      }
    } catch (error) {
      toast.error('Erro ao salvar episódio');
    }
  };

  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '16px',
    },
    title: {
      fontSize: '20px',
      fontWeight: 700,
    },
    addBtn: {
      padding: '12px 24px',
      backgroundColor: '#FFC107',
      color: '#0D0D0F',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    card: {
      backgroundColor: '#0D0D0F',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #2A2A32',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '16px',
      marginBottom: '12px',
    },
    cardTitle: {
      fontWeight: 600,
      fontSize: '16px',
      flex: 1,
    },
    cardStatus: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 500,
      whiteSpace: 'nowrap',
    },
    statusPublished: {
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      color: '#22C55E',
    },
    statusDraft: {
      backgroundColor: 'rgba(251, 191, 36, 0.2)',
      color: '#FBBF24',
    },
    cardMeta: {
      fontSize: '13px',
      color: '#9CA3AF',
      marginBottom: '12px',
    },
    cardActions: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    actionBtn: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: '13px',
    },
    editBtn: {
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      color: '#3B82F6',
    },
    deleteBtn: {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      color: '#EF4444',
    },
    emptyState: {
      textAlign: 'center',
      padding: '48px 24px',
      color: '#9CA3AF',
    },
  };

  if (showForm) {
    return (
      <EpisodeForm 
        episode={editingEpisode}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingEpisode(null);
        }}
      />
    );
  }

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>🎙️ Episódios</h2>
        <button onClick={() => setShowForm(true)} style={styles.addBtn}>
          ➕ Novo Episódio
        </button>
      </div>

      {loading ? (
        <div style={styles.emptyState}>Carregando...</div>
      ) : episodes.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🎧</p>
          <p style={{ marginBottom: '8px' }}>Nenhum episódio cadastrado.</p>
          <p>Clique em "Novo Episódio" para começar!</p>
        </div>
      ) : (
        <div style={styles.list}>
          {episodes.map((episode) => (
            <div key={episode.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>{episode.title}</span>
                <span style={{
                  ...styles.cardStatus,
                  ...(episode.status === 'PUBLISHED' ? styles.statusPublished : styles.statusDraft),
                }}>
                  {episode.status === 'PUBLISHED' ? '✅ Publicado' : '📝 Rascunho'}
                </span>
              </div>
              <div style={styles.cardMeta}>
                {episode.description ? episode.description.substring(0, 100) + '...' : 'Sem descrição'}
              </div>
              <div style={styles.cardActions}>
                <button 
                  onClick={() => handleEdit(episode)} 
                  style={{ ...styles.actionBtn, ...styles.editBtn }}
                >
                  ✏️ Editar
                </button>
                <button 
                  onClick={() => handleDelete(episode.id)} 
                  style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ========== FORMULÁRIO DE EPISÓDIO ==========
const EpisodeForm = ({ episode, onSave, onCancel }) => {
  const [form, setForm] = useState({
    title: episode?.title || '',
    description: episode?.description || '',
    cover_image_url: episode?.cover_image_url || '',
    spotify_url: episode?.spotify_url || '',
    youtube_url: episode?.youtube_url || '',
    tags: episode?.tags || '',
    status: episode?.status || 'DRAFT',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }
    onSave(form);
  };

  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    title: {
      fontSize: '20px',
      fontWeight: 700,
    },
    backBtn: {
      padding: '8px 16px',
      backgroundColor: 'transparent',
      color: '#9CA3AF',
      border: '1px solid #2A2A32',
      borderRadius: '8px',
      cursor: 'pointer',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    field: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontWeight: 500,
      fontSize: '14px',
      color: '#E5E7EB',
    },
    input: {
      padding: '12px 16px',
      backgroundColor: '#0D0D0F',
      border: '1px solid #2A2A32',
      borderRadius: '8px',
      color: 'white',
      fontSize: '15px',
      width: '100%',
      boxSizing: 'border-box',
    },
    textarea: {
      padding: '12px 16px',
      backgroundColor: '#0D0D0F',
      border: '1px solid #2A2A32',
      borderRadius: '8px',
      color: 'white',
      fontSize: '15px',
      width: '100%',
      minHeight: '100px',
      resize: 'vertical',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
    },
    select: {
      padding: '12px 16px',
      backgroundColor: '#0D0D0F',
      border: '1px solid #2A2A32',
      borderRadius: '8px',
      color: 'white',
      fontSize: '15px',
      cursor: 'pointer',
      width: '100%',
      boxSizing: 'border-box',
    },
    hint: {
      fontSize: '12px',
      color: '#6B7280',
    },
    actions: {
      display: 'flex',
      gap: '12px',
      marginTop: '8px',
      flexWrap: 'wrap',
    },
    saveBtn: {
      padding: '14px 32px',
      backgroundColor: '#FFC107',
      color: '#0D0D0F',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '15px',
    },
    cancelBtn: {
      padding: '14px 32px',
      backgroundColor: 'transparent',
      color: '#9CA3AF',
      border: '1px solid #2A2A32',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 500,
    },
  };

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>
          {episode ? '✏️ Editar Episódio' : '➕ Novo Episódio'}
        </h2>
        <button onClick={onCancel} style={styles.backBtn}>
          ← Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Título *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ex: MetôCast #7 - Tema do episódio"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Descrição</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Descreva o conteúdo do episódio..."
            style={styles.textarea}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>🖼️ URL da Imagem de Capa</label>
          <input
            type="url"
            value={form.cover_image_url}
            onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
            placeholder="https://i.scdn.co/image/..."
            style={styles.input}
          />
          <span style={{ fontSize: '12px', color: '#6B7280' }}>
            Dica: No Spotify, clique com botão direito na imagem → "Copiar endereço da imagem"
          </span>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>🎧 Link do Spotify</label>
          <input
            type="url"
            value={form.spotify_url}
            onChange={(e) => setForm({ ...form, spotify_url: e.target.value })}
            placeholder="https://open.spotify.com/episode/..."
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>📺 Link do YouTube</label>
          <input
            type="url"
            value={form.youtube_url}
            onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
            placeholder="https://youtube.com/watch?v=..."
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>🏷️ Tags</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="educação, metodista, podcast"
            style={styles.input}
          />
          <span style={styles.hint}>Separe as tags por vírgula</span>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>📋 Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            style={styles.select}
          >
            <option value="DRAFT">📝 Rascunho - não aparece no site</option>
            <option value="PUBLISHED">✅ Publicado - visível no site</option>
          </select>
        </div>

        <div style={styles.actions}>
          <button type="submit" style={styles.saveBtn}>
            💾 Salvar
          </button>
          <button type="button" onClick={onCancel} style={styles.cancelBtn}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

// ========== GERENCIADOR DE LINKS ==========
const LinkManager = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/links', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('metocast_token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (error) {
      console.error('Erro ao carregar links:', error);
    }
    setLoading(false);
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este link?')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/admin/links/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('metocast_token')}`,
        },
      });
      if (response.ok) {
        setLinks(links.filter(l => l.id !== id));
        toast.success('Link excluído!');
      }
    } catch (error) {
      toast.error('Erro ao excluir link');
    }
  };

  const handleSave = async (linkData) => {
    try {
      const url = editingLink 
        ? `http://localhost:8000/api/admin/links/${editingLink.id}`
        : 'http://localhost:8000/api/admin/links';
      
      const response = await fetch(url, {
        method: editingLink ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('metocast_token')}`,
        },
        body: JSON.stringify(linkData),
      });

      if (response.ok) {
        const saved = await response.json();
        if (editingLink) {
          setLinks(links.map(l => l.id === saved.id ? saved : l));
        } else {
          setLinks([...links, saved]);
        }
        setShowForm(false);
        setEditingLink(null);
        toast.success(editingLink ? 'Link atualizado!' : 'Link criado!');
      }
    } catch (error) {
      toast.error('Erro ao salvar link');
    }
  };

  const getLinkIcon = (type) => {
    const icons = {
      SPOTIFY: '🎧',
      YOUTUBE: '📺',
      INSTAGRAM: '📸',
      SITE: '🌐',
      OTHER: '🔗',
    };
    return icons[type] || '🔗';
  };

  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '16px',
    },
    title: {
      fontSize: '20px',
      fontWeight: 700,
    },
    addBtn: {
      padding: '12px 24px',
      backgroundColor: '#FFC107',
      color: '#0D0D0F',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    card: {
      backgroundColor: '#0D0D0F',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #2A2A32',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px',
    },
    cardIcon: {
      fontSize: '24px',
    },
    cardTitle: {
      fontWeight: 600,
      flex: 1,
    },
    cardUrl: {
      fontSize: '13px',
      color: '#9CA3AF',
      wordBreak: 'break-all',
      marginBottom: '12px',
    },
    cardActions: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    actionBtn: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: '13px',
    },
    editBtn: {
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      color: '#3B82F6',
    },
    deleteBtn: {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      color: '#EF4444',
    },
    emptyState: {
      textAlign: 'center',
      padding: '48px 24px',
      color: '#9CA3AF',
    },
  };

  if (showForm) {
    return (
      <LinkForm 
        link={editingLink}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingLink(null);
        }}
      />
    );
  }

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>🔗 Links Oficiais</h2>
        <button onClick={() => setShowForm(true)} style={styles.addBtn}>
          ➕ Novo Link
        </button>
      </div>

      {loading ? (
        <div style={styles.emptyState}>Carregando...</div>
      ) : links.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔗</p>
          <p style={{ marginBottom: '8px' }}>Nenhum link cadastrado.</p>
          <p>Clique em "Novo Link" para adicionar!</p>
        </div>
      ) : (
        <div style={styles.list}>
          {links.map((link) => (
            <div key={link.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>{getLinkIcon(link.type)}</span>
                <span style={styles.cardTitle}>{link.label}</span>
              </div>
              <div style={styles.cardUrl}>{link.url}</div>
              <div style={styles.cardActions}>
                <button 
                  onClick={() => handleEdit(link)} 
                  style={{ ...styles.actionBtn, ...styles.editBtn }}
                >
                  ✏️ Editar
                </button>
                <button 
                  onClick={() => handleDelete(link.id)} 
                  style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ========== FORMULÁRIO DE LINK ==========
const LinkForm = ({ link, onSave, onCancel }) => {
  const [form, setForm] = useState({
    label: link?.label || '',
    url: link?.url || '',
    type: link?.type || 'OTHER',
    order: link?.order || 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.label.trim() || !form.url.trim()) {
      toast.error('Preencha nome e URL');
      return;
    }
    onSave(form);
  };

  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    title: {
      fontSize: '20px',
      fontWeight: 700,
    },
    backBtn: {
      padding: '8px 16px',
      backgroundColor: 'transparent',
      color: '#9CA3AF',
      border: '1px solid #2A2A32',
      borderRadius: '8px',
      cursor: 'pointer',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    field: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontWeight: 500,
      fontSize: '14px',
      color: '#E5E7EB',
    },
    input: {
      padding: '12px 16px',
      backgroundColor: '#0D0D0F',
      border: '1px solid #2A2A32',
      borderRadius: '8px',
      color: 'white',
      fontSize: '15px',
      width: '100%',
      boxSizing: 'border-box',
    },
    select: {
      padding: '12px 16px',
      backgroundColor: '#0D0D0F',
      border: '1px solid #2A2A32',
      borderRadius: '8px',
      color: 'white',
      fontSize: '15px',
      cursor: 'pointer',
      width: '100%',
      boxSizing: 'border-box',
    },
    actions: {
      display: 'flex',
      gap: '12px',
      marginTop: '8px',
      flexWrap: 'wrap',
    },
    saveBtn: {
      padding: '14px 32px',
      backgroundColor: '#FFC107',
      color: '#0D0D0F',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '15px',
    },
    cancelBtn: {
      padding: '14px 32px',
      backgroundColor: 'transparent',
      color: '#9CA3AF',
      border: '1px solid #2A2A32',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 500,
    },
  };

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>
          {link ? '✏️ Editar Link' : '➕ Novo Link'}
        </h2>
        <button onClick={onCancel} style={styles.backBtn}>
          ← Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Nome *</label>
          <input
            type="text"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            placeholder="Ex: Spotify, YouTube, Instagram..."
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>URL *</label>
          <input
            type="url"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://..."
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Tipo</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            style={styles.select}
          >
            <option value="SPOTIFY">🎧 Spotify</option>
            <option value="YOUTUBE">📺 YouTube</option>
            <option value="INSTAGRAM">📸 Instagram</option>
            <option value="SITE">🌐 Site</option>
            <option value="OTHER">🔗 Outro</option>
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Ordem de exibição</label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
            placeholder="0"
            style={styles.input}
            min="0"
          />
        </div>

        <div style={styles.actions}>
          <button type="submit" style={styles.saveBtn}>
            💾 Salvar
          </button>
          <button type="button" onClick={onCancel} style={styles.cancelBtn}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPanel;
