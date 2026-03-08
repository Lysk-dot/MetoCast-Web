import type { Metadata } from "next";
import EpisodeCard from "@/components/EpisodeCard";
import Pagination from "@/components/Pagination";
import { getEpisodesPaginated } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "Episódios",
  description: "Todos os episódios do podcast MetôCast.",
};

export const revalidate = 600;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function EpisodiosPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const { episodes, totalPages, currentPage } = await getEpisodesPaginated(page, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="w-12 h-1 bg-primary-yellow rounded-full mb-4" />
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Episódios
        </h1>
        <p className="text-foreground-muted">
          Todos os episódios do MetôCast, direto do nosso canal no YouTube.
        </p>
      </div>

      {/* Episode Grid */}
      {episodes.length === 0 ? (
        <p className="text-gray-500 text-center py-16">
          Nenhum episódio disponível no momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodes.map((episode) => (
            <EpisodeCard key={episode.videoId} episode={episode} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/episodios"
      />
    </div>
  );
}
