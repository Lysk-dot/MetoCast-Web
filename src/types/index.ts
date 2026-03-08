export interface Episode {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
}

export interface Comment {
  id: number;
  videoId: string;
  author: string;
  message: string;
  createdAt: string;
}

export interface Suggestion {
  id: number;
  author: string;
  title: string;
  description: string;
  votes: number;
  createdAt: string;
}

export interface PageView {
  id: number;
  path: string;
  sessionId: string;
  createdAt: string;
}

export interface VideoView {
  id: number;
  videoId: string;
  sessionId: string;
  watchSeconds: number;
  createdAt: string;
}

export interface MetricsSummary {
  totalPageViews: number;
  uniqueSessions: number;
  topPages: { path: string; name: string; count: number }[];
  totalVideoViews: number;
  totalWatchMinutes: number;
  topVideos: { videoId: string; title: string; views: number; minutes: number }[];
}

export interface Participacao {
  id: number;
  nome: string;
  cargo: string | null;
  episodio: string | null;
  videoId: string | null;
  data: string | null;
  fotoUrl: string | null;
  videoUrl: string | null;
  createdAt: string;
}
