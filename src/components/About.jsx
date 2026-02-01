import { Mic, BookOpen, Rocket, Users, Target, Heart } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Mic,
      title: 'Podcast',
      description: 'Conversas autênticas sobre temas que importam para você.',
      color: '#FFC107',
      bgColor: 'rgba(255, 193, 7, 0.1)',
    },
    {
      icon: BookOpen,
      title: 'Educação',
      description: 'Conteúdo educacional criado por estudantes para estudantes.',
      color: '#1E88E5',
      bgColor: 'rgba(30, 136, 229, 0.1)',
    },
    {
      icon: Rocket,
      title: 'Futuro',
      description: 'Discussões sobre carreira, tecnologia e o que vem por aí.',
      color: '#6C5CE7',
      bgColor: 'rgba(108, 92, 231, 0.1)',
    },
  ];

  const styles = {
    section: {
      padding: '80px 16px',
      backgroundColor: '#0D0D0F',
      width: '100%',
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      width: '100%',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '48px',
      alignItems: 'center',
    },
    badge: {
      display: 'inline-block',
      padding: '6px 16px',
      backgroundColor: 'rgba(30, 136, 229, 0.1)',
      color: '#1E88E5',
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
      marginBottom: '24px',
    },
    highlight: {
      color: '#FFC107',
    },
    textLarge: {
      fontSize: '20px',
      color: '#D1D5DB',
      lineHeight: 1.7,
      marginBottom: '16px',
    },
    textNormal: {
      color: '#9CA3AF',
      lineHeight: 1.7,
      marginBottom: '24px',
    },
    featuresRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      marginBottom: '24px',
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#D1D5DB',
    },
    instagramBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #E4405F, #6C5CE7, #1E88E5)',
      color: 'white',
      fontWeight: 600,
      borderRadius: '50px',
      textDecoration: 'none',
      transition: 'all 0.2s',
    },
    featuresGrid: {
      display: 'grid',
      gap: '24px',
    },
    featureCard: {
      backgroundColor: '#1E1E24',
      borderRadius: '16px',
      padding: '24px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      border: '1px solid #2A2A32',
      transition: 'all 0.3s',
    },
    featureIconBox: {
      padding: '12px',
      borderRadius: '12px',
    },
    featureTitle: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 700,
      fontSize: '18px',
      color: 'white',
      marginBottom: '4px',
    },
    featureDesc: {
      color: '#9CA3AF',
    },
  };

  return (
    <section id="about" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* Conteúdo de texto */}
          <div>
            <span style={styles.badge}>🎓 Extensão Universitária</span>
            
            <h2 style={styles.title}>
              O que é o <span style={styles.highlight}>MetoCast</span>?
            </h2>
            
            <p style={styles.textLarge}>
              Somos o <strong style={styles.highlight}>PodCast oficial dos alunos da Metodista</strong>. 
              Um espaço criado por estudantes para compartilhar conhecimento, 
              experiências e conversas que fazem a diferença.
            </p>
            
            <p style={styles.textNormal}>
              Discutimos futuro, educação, metodologia e muito mais! 
              Nosso objetivo é dar voz aos estudantes e criar conexões 
              através de histórias inspiradoras e conteúdo relevante.
            </p>

            <div style={styles.featuresRow}>
              <div style={styles.featureItem}>
                <Users style={{ width: '20px', height: '20px', color: '#FFC107' }} />
                <span>Feito por estudantes</span>
              </div>
              <div style={styles.featureItem}>
                <Target style={{ width: '20px', height: '20px', color: '#1E88E5' }} />
                <span>Para comunidade</span>
              </div>
              <div style={styles.featureItem}>
                <Heart style={{ width: '20px', height: '20px', color: '#E4405F' }} />
                <span>Com muito amor</span>
              </div>
            </div>

            {/* CTA */}
            <a
              href="https://www.instagram.com/meto_cast/"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.instagramBtn}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Siga no Instagram
            </a>
          </div>

          {/* Cards de features */}
          <div style={styles.featuresGrid}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  style={{ ...styles.featureCard, borderColor: `${feature.color}30` }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = feature.color; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = `${feature.color}30`; }}
                >
                  <div style={{ ...styles.featureIconBox, backgroundColor: feature.bgColor }}>
                    <Icon style={{ width: '24px', height: '24px', color: feature.color }} />
                  </div>
                  <div>
                    <h3 style={styles.featureTitle}>{feature.title}</h3>
                    <p style={styles.featureDesc}>{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
