import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Mic, 
  Link as LinkIcon, 
  LogOut,
  Menu,
  X,
  TrendingUp,
  Eye,
  Calendar,
  Headphones
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const Dashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEpisodes: 0,
    publishedEpisodes: 0,
    draftEpisodes: 0,
    totalLinks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [episodesRes, linksRes] = await Promise.all([
        api.getAdminEpisodes(),
        api.getAdminLinks(),
      ]);

      const episodes = episodesRes.data || [];
      const links = linksRes.data || [];

      setStats({
        totalEpisodes: episodes.length,
        publishedEpisodes: episodes.filter(e => e.status === 'published').length,
        draftEpisodes: episodes.filter(e => e.status === 'draft').length,
        totalLinks: links.length,
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      // Valores de exemplo
      setStats({
        totalEpisodes: 3,
        publishedEpisodes: 2,
        draftEpisodes: 1,
        totalLinks: 4,
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Episódios',
      value: stats.totalEpisodes,
      icon: Mic,
      color: 'yellow',
      onClick: () => onNavigate('episodes'),
    },
    {
      title: 'Publicados',
      value: stats.publishedEpisodes,
      icon: Eye,
      color: 'green',
      onClick: () => onNavigate('episodes'),
    },
    {
      title: 'Rascunhos',
      value: stats.draftEpisodes,
      icon: Calendar,
      color: 'orange',
      onClick: () => onNavigate('episodes'),
    },
    {
      title: 'Links Oficiais',
      value: stats.totalLinks,
      icon: LinkIcon,
      color: 'blue',
      onClick: () => onNavigate('links'),
    },
  ];

  const colorClasses = {
    yellow: 'bg-yellow-primary/20 text-yellow-primary border-yellow-primary/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    blue: 'bg-blue-primary/20 text-blue-primary border-blue-primary/30',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-white mb-2">
          Bem-vindo ao Painel! 👋
        </h1>
        <p className="text-gray-400">
          Gerencie os episódios e links do MetoCast.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <button
              key={index}
              onClick={stat.onClick}
              className={`card text-left border ${colorClasses[stat.color]} hover:scale-105 transition-transform`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[stat.color].split(' ')[0]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <TrendingUp className="w-5 h-5 text-gray-500" />
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-white">
                {loading ? '...' : stat.value}
              </p>
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="font-heading text-xl font-bold text-white mb-6">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('episodes', { action: 'new' })}
            className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-surface-hover hover:border-yellow-primary/50 transition-all group"
          >
            <div className="p-3 rounded-xl bg-yellow-primary/20 text-yellow-primary group-hover:bg-yellow-primary group-hover:text-surface-dark transition-all">
              <Mic className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-white">Novo Episódio</p>
              <p className="text-sm text-gray-500">Adicionar um novo episódio</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('links', { action: 'new' })}
            className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-surface-hover hover:border-blue-primary/50 transition-all group"
          >
            <div className="p-3 rounded-xl bg-blue-primary/20 text-blue-primary group-hover:bg-blue-primary group-hover:text-white transition-all">
              <LinkIcon className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-white">Novo Link</p>
              <p className="text-sm text-gray-500">Adicionar link oficial</p>
            </div>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="card bg-gradient-to-br from-yellow-primary/10 to-blue-primary/10 border-yellow-primary/30">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-yellow-primary/20">
            <Headphones className="w-6 h-6 text-yellow-primary" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-white mb-2">
              MetoCast Admin
            </h3>
            <p className="text-gray-400 text-sm">
              Este painel permite gerenciar todo o conteúdo do MetoCast. 
              Adicione novos episódios, edite informações e gerencie os links oficiais 
              para as plataformas de streaming.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
