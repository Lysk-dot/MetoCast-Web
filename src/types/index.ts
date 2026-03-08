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
