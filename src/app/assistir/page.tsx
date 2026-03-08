import type { Metadata } from "next";
import Link from "next/link";
import { Play } from "lucide-react";
import YouTubePlayer from "@/components/YouTubePlayer";
import { getEpisodes } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "Assistir",
  description: "Assista todos os episódios do MetôCast diretamente nesta página.",
};

export const revalidate = 600;

export default async function AssistirPage() {
  const episodes = await getEpisodes();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Assistir
        </h1>
        <p className="text-foreground-muted">
          Assista todos os episódios do MetôCast direto aqui, sem sair do site.
        </p>
      </div>

      {episodes.length === 0 ? (
        <p className="text-gray-500 text-center py-16">
          Nenhum episódio disponível no momento.
        </p>
      ) : (
        <div className="space-y-10">
          {episodes.map((episode) => (
            <div
              key={episode.videoId}
              className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden"
            >
              <YouTubePlayer videoId={episode.videoId} title={episode.title} />
              <div className="p-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="font-heading font-semibold text-foreground truncate">
                    {episode.title}
                  </h2>
                  <p className="text-sm text-foreground-faint mt-1">
                    {new Date(episode.publishedAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <Link
                  href={`/episodio/${episode.videoId}`}
                  className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-primary-yellow text-gray-900 font-semibold rounded-lg hover:brightness-110 transition-all text-sm"
                >
                  <Play size={14} />
                  Detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
