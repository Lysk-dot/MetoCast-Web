import Link from "next/link";
import { Play, Calendar } from "lucide-react";
import { Episode } from "@/types";

interface EpisodeCardProps {
  episode: Episode;
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
  const date = new Date(episode.publishedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const shortDescription =
    episode.description.length > 120
      ? episode.description.slice(0, 120) + "..."
      : episode.description;

  return (
    <div className="group bg-surface-card border border-surface-border rounded-2xl overflow-hidden hover:border-primary-yellow/30 transition-all duration-300">
      {/* Thumbnail */}
      <Link href={`/episodio/${episode.videoId}`} className="block relative">
        <img
          src={episode.thumbnail}
          alt={episode.title}
          className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary-yellow/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={20} className="text-gray-900 ml-0.5" />
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs text-foreground-faint">
          <Calendar size={12} />
          <time dateTime={episode.publishedAt}>{date}</time>
        </div>

        <Link href={`/episodio/${episode.videoId}`}>
          <h3 className="font-heading font-semibold text-foreground group-hover:text-primary-yellow transition-colors line-clamp-2">
            {episode.title}
          </h3>
        </Link>

        {shortDescription && (
          <p className="text-sm text-foreground-muted line-clamp-2">
            {shortDescription}
          </p>
        )}

        <Link
          href={`/episodio/${episode.videoId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-yellow hover:text-primary-yellow-light transition-colors pt-1"
        >
          <Play size={14} />
          Assistir episódio
        </Link>
      </div>
    </div>
  );
}
