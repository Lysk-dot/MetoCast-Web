import { Calendar, ExternalLink } from 'lucide-react';

const EpisodeCard = ({ episode }) => {
  const {
    title,
    description,
    thumbnail_url,
    cover_image_url,
    published_at,
    spotify_url,
    youtube_url,
    tags = [],
  } = episode;

  // Imagem final a ser usada (cover_image_url do backend ou fallback para logo)
  const imageUrl = cover_image_url || thumbnail_url;

  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Truncar descrição
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const styles = {
    card: {
      backgroundColor: '#1E1E24',
      borderRadius: '16px',
      padding: '16px',
      cursor: 'pointer',
      overflow: 'hidden',
      transition: 'all 0.3s',
      border: '1px solid #2A2A32',
    },
    thumbnailContainer: {
      position: 'relative',
      aspectRatio: '16/9',
      marginBottom: '16px',
      borderRadius: '12px',
      overflow: 'hidden',
      background: '#1B4B8A',
    },
    thumbnail: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s',
    },
    placeholderContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1B4B8A',
    },
    placeholderLogo: {
      width: '60%',
      height: '60%',
      objectFit: 'contain',
    },
    placeholderIcon: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tagsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '12px',
    },
    tag: {
      fontSize: '12px',
      padding: '4px 8px',
      borderRadius: '50px',
      backgroundColor: 'rgba(30, 136, 229, 0.2)',
      color: '#1E88E5',
    },
    title: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      fontSize: '18px',
      color: 'white',
      marginBottom: '8px',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    description: {
      color: '#9CA3AF',
      fontSize: '14px',
      marginBottom: '12px',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    dateContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#6B7280',
      fontSize: '14px',
      marginBottom: '12px',
    },
    linksContainer: {
      display: 'flex',
      gap: '12px',
      paddingTop: '8px',
    },
    spotifyBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: 'rgba(29, 185, 84, 0.2)',
      color: '#1DB954',
      borderRadius: '50px',
      fontSize: '14px',
      fontWeight: 500,
      textDecoration: 'none',
      transition: 'all 0.2s',
    },
    youtubeBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: 'rgba(255, 0, 0, 0.2)',
      color: '#FF0000',
      borderRadius: '50px',
      fontSize: '14px',
      fontWeight: 500,
      textDecoration: 'none',
      transition: 'all 0.2s',
    },
  };

  return (
    <article 
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = '#FFC107';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#2A2A32';
      }}
    >
      {/* Thumbnail */}
      <div style={styles.thumbnailContainer}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            style={styles.thumbnail}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div style={{ ...styles.placeholderContainer, display: imageUrl ? 'none' : 'flex' }}>
          <img 
            src={import.meta.env.BASE_URL + 'images/logo-metocast.png'}
            alt="MetoCast"
            style={styles.placeholderLogo}
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div>
        {/* Tags */}
        {tags.length > 0 && (
          <div style={styles.tagsContainer}>
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} style={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Título */}
        <h3 style={styles.title}>{title}</h3>

        {/* Descrição */}
        <p style={styles.description}>
          {truncateText(description, 120)}
        </p>

        {/* Data */}
        {published_at && (
          <div style={styles.dateContainer}>
            <Calendar style={{ width: '16px', height: '16px' }} />
            <span>{formatDate(published_at)}</span>
          </div>
        )}

        {/* Links */}
        <div style={styles.linksContainer}>
          {spotify_url && (
            <a
              href={spotify_url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.spotifyBtn}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#1DB954'; e.target.style.color = 'white'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = 'rgba(29, 185, 84, 0.2)'; e.target.style.color = '#1DB954'; }}
            >
              <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Spotify
            </a>
          )}
          
          {youtube_url && (
            <a
              href={youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.youtubeBtn}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#FF0000'; e.target.style.color = 'white'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = 'rgba(255, 0, 0, 0.2)'; e.target.style.color = '#FF0000'; }}
            >
              <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default EpisodeCard;
