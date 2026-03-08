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
  topPages: { path: string; count: number }[];
  totalVideoViews: number;
  totalWatchMinutes: number;
  topVideos: { videoId: string; views: number; minutes: number }[];
}
