import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Headphones } from 'lucide-react';
import EpisodeCard from './EpisodeCard';
import { api } from '../services/api';

const EpisodeGrid = () => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEpisodes();
  }, []);

  const fetchEpisodes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getEpisodes();
      setEpisodes(response.data || []);
    } catch (err) {
      console.error('Erro ao buscar episódios:', err);
      setError('Não foi possível carregar os episódios. Verifique se o servidor está online.');
      setEpisodes([]);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    section: {
      padding: '80px 16px',
      backgroundColor: '#1A1A1F',
      width: '100%',
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      width: '100%',
    },
    header: {
      textAlign: 'center',
      marginBottom: '48px',
    },
    badge: {
      display: 'inline-block',
      padding: '6px 16px',
      backgroundColor: 'rgba(255, 193, 7, 0.1)',
      color: '#FFC107',
      borderRadius: '50px',
      fontSize: '14px',
      fontWeight: 500,
      marginBottom: '16px',
    },
    title: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: 'clamp(32px, 5vw, 48px)',
      fontWeight: 700,
      color: 'white',
      marginBottom: '16px',
    },
    highlight: {
      color: '#FFC107',
    },
    subtitle: {
      color: '#9CA3AF',
      fontSize: '18px',
      maxWidth: '672px',
      margin: '0 auto',
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 0',
    },
    loadingText: {
      color: '#9CA3AF',
      marginTop: '16px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      width: '100%',
    },
    ctaContainer: {
      textAlign: 'center',
      marginTop: '48px',
    },
    ctaBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      backgroundColor: '#FFC107',
      color: '#0D0D0F',
      borderRadius: '50px',
      fontWeight: 600,
      textDecoration: 'none',
      transition: 'all 0.2s',
    },
  };

  return (
    <section id="episodes" style={styles.section}>
      <div style={styles.container}>
        {/* Header da seção */}
        <div style={styles.header}>
          <span style={styles.badge}>🎧 Ouça agora</span>
          <h2 style={styles.title}>
            Últimos <span style={styles.highlight}>Episódios</span>
          </h2>
          <p style={styles.subtitle}>
            Confira nossos episódios mais recentes e não perca nenhuma novidade!
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={styles.loadingContainer}>
            <Loader2 style={{ width: '40px', height: '40px', color: '#FFC107', animation: 'spin 1s linear infinite' }} />
            <p style={styles.loadingText}>Carregando episódios...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div style={styles.loadingContainer}>
            <AlertCircle style={{ width: '40px', height: '40px', color: '#FFC107' }} />
            <p style={styles.loadingText}>{error}</p>
          </div>
        )}

        {/* Grid de episódios */}
        {!loading && episodes.length > 0 && (
          <div style={styles.grid}>
            {episodes.map((episode, index) => (
              <div
                key={episode.id || index}
                style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`, opacity: 0 }}
              >
                <EpisodeCard episode={episode} />
              </div>
            ))}
          </div>
        )}

        {/* Ver mais episódios */}
        <div style={styles.ctaContainer}>
          <a
            href="https://open.spotify.com/show/1QpRW5ISZzqqJyd3orYxsy"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.ctaBtn}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#FFA000'; e.target.style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = '#FFC107'; e.target.style.transform = 'scale(1)'; }}
          >
            <Headphones style={{ width: '20px', height: '20px' }} />
            Ver todos os episódios
          </a>
        </div>
      </div>
    </section>
  );
};

export default EpisodeGrid;
