const Hero = () => {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, #0D0D0F 50%, rgba(30, 136, 229, 0.1) 100%)'
    }}>
      {/* Ondas animadas de fundo */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
        <svg
          style={{ position: 'absolute', bottom: 0, width: '100%', height: '16rem' }}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="url(#wave-gradient)"
            d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,154.7C960,149,1056,171,1152,176C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFC107" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1E88E5" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Círculos decorativos */}
      <div style={{
        position: 'absolute',
        top: '5rem',
        left: '2.5rem',
        width: '18rem',
        height: '18rem',
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        borderRadius: '50%',
        filter: 'blur(48px)',
        animation: 'pulse 2s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '5rem',
        right: '2.5rem',
        width: '24rem',
        height: '24rem',
        backgroundColor: 'rgba(30, 136, 229, 0.2)',
        borderRadius: '50%',
        filter: 'blur(48px)',
        animation: 'pulse 2s ease-in-out infinite'
      }} />

      {/* Conteúdo */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: '5rem 1rem 2rem',
        maxWidth: '56rem',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <div className="animate-float" style={{
            width: '12rem',
            height: '12rem',
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(255, 193, 7, 0.4)',
            border: '4px solid rgba(255, 193, 7, 0.3)',
            backgroundColor: '#1B4B8A'
          }}>
            <img 
              src={import.meta.env.BASE_URL + 'images/logo-metocast.png'}
              alt="MetoCast Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.src = import.meta.env.BASE_URL + 'images/logo-metocast.svg';
              }}
            />
          </div>
        </div>

        {/* Título */}
        <h1 style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: 'clamp(3rem, 8vw, 5rem)',
          fontWeight: 800,
          marginBottom: '1rem',
          lineHeight: 1.1
        }}>
          <span style={{ color: 'white' }}>Meto</span>
          <span style={{ color: '#FFC107' }}>Cast</span>
        </h1>

        {/* Subtítulo */}
        <p style={{
          fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
          color: '#d1d5db',
          marginBottom: '1rem',
          fontWeight: 500
        }}>
          🎙️ PodCast oficial dos alunos da{' '}
          <span style={{ color: '#1E88E5', fontWeight: 600 }}>Metodista</span>
        </p>
        
        <p style={{
          fontSize: '1.125rem',
          color: '#9ca3af',
          marginBottom: '2rem',
          maxWidth: '40rem',
          margin: '0 auto 2rem'
        }}>
          Futuro, educação, voz, histórias e mais. Venha fazer parte dessa conversa!
        </p>

        {/* Badges */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0.75rem',
          marginBottom: '2.5rem'
        }}>
          <span className="badge badge-yellow">🎒 Educação</span>
          <span className="badge badge-blue">🎓 Extensão Universitária</span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 500,
            backgroundColor: 'rgba(108, 92, 231, 0.2)',
            color: '#6C5CE7'
          }}>🔮 Futuro</span>
        </div>

        {/* CTAs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <a
            href="https://open.spotify.com/show/1QpRW5ISZzqqJyd3orYxsy"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-spotify"
            style={{ fontSize: '1.125rem' }}
          >
            <svg style={{ width: '1.5rem', height: '1.5rem' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Ouvir no Spotify
          </a>

          {/* YouTube button desabilitado */}
          {/* <a
            href="https://www.youtube.com/@MetoCast"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-youtube"
            style={{ fontSize: '1.125rem' }}
          >
            <svg style={{ width: '1.5rem', height: '1.5rem' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Ver no YouTube
          </a> */}
        </div>

        {/* Social Links */}
        <div style={{
          marginTop: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem'
        }}>
          <a
            href="https://www.instagram.com/meto_cast/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '50px',
              backgroundColor: 'rgba(228, 64, 95, 0.2)',
              color: '#E4405F',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 500,
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(228, 64, 95, 0.4)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(228, 64, 95, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            📸 Instagram
          </a>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
