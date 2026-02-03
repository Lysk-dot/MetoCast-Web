import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import EpisodeGrid from '../components/EpisodeGrid';
import About from '../components/About';
// import Team from '../components/Team'; // TODO: Descomentar quando tiver os membros da equipe
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div style={{ minHeight: '100vh', width: '100%', backgroundColor: '#0D0D0F' }}>
      <Navbar />
      <main style={{ width: '100%' }}>
        <Hero />
        <EpisodeGrid />
        <About />
        {/* <Team /> */}{/* TODO: Descomentar quando tiver os membros da equipe */}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
