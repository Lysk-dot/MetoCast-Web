"use client";

import { useState } from "react";
import { Play, Calendar, ListVideo } from "lucide-react";
import YouTubePlayer from "@/components/YouTubePlayer";
import { Episode } from "@/types";

interface AssistirClientProps {
  episodes: Episode[];
}

export default function AssistirClient({ episodes }: AssistirClientProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (episodes.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-gray-500 text-center py-16">
          Nenhum episódio disponível no momento.
        </p>
      </div>
    );
  }

  const current = episodes[selectedIndex];
  const date = new Date(current.publishedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Player Area */}
        <div className="flex-1 min-w-0">
          <YouTubePlayer videoId={current.videoId} title={current.title} />

          {/* Episode Info */}
          <div className="mt-4 space-y-3">
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-foreground leading-tight">
              {current.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-foreground-faint">
              <Calendar size={14} />
              <time dateTime={current.publishedAt}>{date}</time>
            </div>
            {current.description && (
              <div className="bg-surface-card border border-surface-border rounded-xl p-4">
                <p className="text-sm text-foreground-secondary whitespace-pre-wrap leading-relaxed line-clamp-4">
                  {current.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Playlist */}
        <div className="lg:w-[380px] flex-shrink-0">
          <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
            {/* Playlist Header */}
            <div className="px-4 py-3 border-b border-surface-border flex items-center gap-2">
              <ListVideo size={18} className="text-primary-yellow" />
              <h2 className="font-heading font-semibold text-foreground text-sm">
                Todos os episódios
              </h2>
              <span className="ml-auto text-xs text-foreground-faint">
                {episodes.length} eps
              </span>
            </div>

            {/* Episode List */}
            <div className="max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-thin">
              {episodes.map((episode, index) => {
                const isActive = index === selectedIndex;
                const epDate = new Date(episode.publishedAt).toLocaleDateString("pt-BR");

                return (
                  <button
                    key={episode.videoId}
                    onClick={() => setSelectedIndex(index)}
                    className={`w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-surface-hover ${
                      isActive
                        ? "bg-primary-yellow/10 border-l-2 border-l-primary-yellow"
                        : "border-l-2 border-l-transparent"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0 w-28 aspect-video rounded-lg overflow-hidden bg-surface-border">
                      <img
                        src={episode.thumbnail}
                        alt={episode.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Play size={16} className="text-primary-yellow" fill="currentColor" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 py-0.5">
                      <p
                        className={`text-xs font-medium leading-snug line-clamp-2 ${
                          isActive ? "text-primary-yellow" : "text-foreground"
                        }`}
                      >
                        {episode.title}
                      </p>
                      <p className="text-[11px] text-foreground-faint mt-1">{epDate}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
