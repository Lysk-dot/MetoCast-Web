import { User } from 'lucide-react';

const Team = () => {
  const members = [
    { id: 1, name: 'Membro 1', role: 'Apresentador' },
    { id: 2, name: 'Membro 2', role: 'Apresentadora' },
    { id: 3, name: 'Membro 3', role: 'Produção' },
    { id: 4, name: 'Membro 4', role: 'Edição' },
    { id: 5, name: 'Membro 5', role: 'Social Media' },
    { id: 6, name: 'Membro 6', role: 'Convidado' },
  ];

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
      color: '#1E88E5',
    },
    subtitle: {
      color: '#9CA3AF',
      fontSize: '18px',
      maxWidth: '672px',
      margin: '0 auto',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '24px',
      width: '100%',
    },
    memberCard: {
      textAlign: 'center',
      cursor: 'pointer',
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: '16px',
    },
    avatar: {
      width: 'clamp(96px, 15vw, 128px)',
      height: 'clamp(96px, 15vw, 128px)',
      margin: '0 auto',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.3), rgba(30, 136, 229, 0.3))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid #2A2A32',
      transition: 'all 0.3s',
    },
    memberName: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
      color: 'white',
      marginBottom: '4px',
      transition: 'color 0.2s',
    },
    memberRole: {
      color: '#6B7280',
      fontSize: '14px',
    },
    ctaContainer: {
      marginTop: '64px',
      textAlign: 'center',
    },
    ctaBox: {
      display: 'inline-block',
      padding: '32px',
      borderRadius: '16px',
      background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(30, 136, 229, 0.1))',
      border: '1px solid #2A2A32',
    },
    ctaText: {
      color: '#D1D5DB',
      marginBottom: '16px',
    },
    ctaLink: {
      color: '#FFC107',
      textDecoration: 'none',
      fontWeight: 500,
      transition: 'color 0.2s',
    },
  };

  return (
    <section id="team" style={styles.section}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.badge}>👥 Conheça a equipe</span>
          <h2 style={styles.title}>
            Nossa <span style={styles.highlight}>Equipe</span>
          </h2>
          <p style={styles.subtitle}>
            Estudantes apaixonados por criar conteúdo relevante e conectar pessoas.
          </p>
        </div>

        {/* Grid de membros */}
        <div style={styles.grid}>
          {members.map((member, index) => (
            <div
              key={member.id}
              style={styles.memberCard}
              onMouseEnter={(e) => {
                const avatar = e.currentTarget.querySelector('.avatar');
                const name = e.currentTarget.querySelector('.name');
                if (avatar) avatar.style.borderColor = '#FFC107';
                if (name) name.style.color = '#FFC107';
              }}
              onMouseLeave={(e) => {
                const avatar = e.currentTarget.querySelector('.avatar');
                const name = e.currentTarget.querySelector('.name');
                if (avatar) avatar.style.borderColor = '#2A2A32';
                if (name) name.style.color = 'white';
              }}
            >
              {/* Avatar */}
              <div style={styles.avatarContainer}>
                <div className="avatar" style={styles.avatar}>
                  <User style={{ width: 'clamp(48px, 8vw, 64px)', height: 'clamp(48px, 8vw, 64px)', color: '#6B7280' }} />
                </div>
              </div>

              {/* Info */}
              <h3 className="name" style={styles.memberName}>{member.name}</h3>
              <p style={styles.memberRole}>{member.role}</p>
            </div>
          ))}
        </div>

        {/* Foto em grupo CTA */}
        <div style={styles.ctaContainer}>
          <div style={styles.ctaBox}>
            <p style={styles.ctaText}>
              🎽 Equipe usando as camisas oficiais do MetoCast!
            </p>
            <a
              href="https://www.instagram.com/meto_cast/"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.ctaLink}
              onMouseEnter={(e) => e.target.style.color = '#FFA000'}
              onMouseLeave={(e) => e.target.style.color = '#FFC107'}
            >
              Veja mais fotos no Instagram →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
