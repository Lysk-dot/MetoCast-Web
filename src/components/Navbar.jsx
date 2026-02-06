import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navLinks = [
    { name: 'Início', href: '/', isRoute: true },
    { name: 'Episódios', href: '#episodes', isRoute: false },
    { name: 'Sobre', href: '#about', isRoute: false },
    // { name: 'Equipe', href: '#team' }, // TODO: Descomentar quando tiver os membros da equipe
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  const styles = {
    nav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: 'rgba(13, 13, 15, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #2A2A32',
      width: '100%',
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 16px',
      width: '100%',
    },
    flexContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
    },
    logoLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      textDecoration: 'none',
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #FFC107, #1E88E5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoText: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      fontSize: '20px',
      color: 'white',
    },
    logoHighlight: {
      color: '#FFC107',
    },
    desktopNav: {
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
    },
    navLink: {
      color: '#B0B0B8',
      textDecoration: 'none',
      fontWeight: 500,
      transition: 'color 0.2s',
    },
    spotifyBtn: {
      padding: '8px 16px',
      backgroundColor: '#1DB954',
      color: 'white',
      borderRadius: '50px',
      fontSize: '14px',
      fontWeight: 600,
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s',
    },
    menuBtn: {
      padding: '8px',
      color: '#B0B0B8',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
    },
    mobileMenu: {
      backgroundColor: '#1A1A1F',
      borderTop: '1px solid #2A2A32',
      padding: '16px',
    },
    mobileLink: {
      display: 'block',
      color: '#B0B0B8',
      textDecoration: 'none',
      fontWeight: 500,
      padding: '8px 0',
    },
    mobileSpotifyBtn: {
      display: 'block',
      width: '100%',
      textAlign: 'center',
      padding: '12px 16px',
      backgroundColor: '#1DB954',
      color: 'white',
      borderRadius: '50px',
      fontSize: '14px',
      fontWeight: 600,
      textDecoration: 'none',
      marginTop: '16px',
    },
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.flexContainer}>
          {/* Logo */}
          <Link to="/" style={styles.logoLink}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#1B4B8A'
            }}>
              <img 
                src={import.meta.env.BASE_URL + 'images/logo-metocast.png'}
                alt="MetôCast"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = import.meta.env.BASE_URL + 'images/logo-metocast.svg'; }}
              />
            </div>
            <span style={styles.logoText}>
              Metô<span style={styles.logoHighlight}>Cast</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div style={styles.desktopNav}>
              {navLinks.map((link) => (
                link.isRoute ? (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={handleHomeClick}
                    style={styles.navLink}
                    onMouseEnter={(e) => e.target.style.color = '#FFC107'}
                    onMouseLeave={(e) => e.target.style.color = '#B0B0B8'}
                  >
                    {link.name}
                  </a>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    style={styles.navLink}
                    onMouseEnter={(e) => e.target.style.color = '#FFC107'}
                    onMouseLeave={(e) => e.target.style.color = '#B0B0B8'}
                  >
                    {link.name}
                  </a>
                )
              ))}
              
              {/* CTA Spotify */}
              <a
                href="https://open.spotify.com/show/1QpRW5ISZzqqJyd3orYxsy"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.spotifyBtn}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1ed760'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#1DB954'}
              >
                <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Ouvir
              </a>
            </div>
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <button onClick={() => setIsOpen(!isOpen)} style={styles.menuBtn}>
              {isOpen ? <X style={{ width: '24px', height: '24px' }} /> : <Menu style={{ width: '24px', height: '24px' }} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && isMobile && (
        <div style={styles.mobileMenu}>
          {navLinks.map((link) => (
            link.isRoute ? (
              <a
                key={link.name}
                href={link.href}
                onClick={handleHomeClick}
                style={styles.mobileLink}
              >
                {link.name}
              </a>
            ) : (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                style={styles.mobileLink}
              >
                {link.name}
              </a>
            )
          ))}
          <a
            href="https://open.spotify.com/show/1QpRW5ISZzqqJyd3orYxsy"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.mobileSpotifyBtn}
          >
            🎧 Ouvir no Spotify
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
