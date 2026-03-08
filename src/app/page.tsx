import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import EpisodeCard from "@/components/EpisodeCard";
import { getEpisodes } from "@/lib/youtube";

export const revalidate = 600; // revalidate every 10 minutes

export default async function HomePage() {
  const episodes = await getEpisodes();
  const latestEpisodes = episodes.slice(0, 3);

  return (
    <>
      <Hero />

      {/* Latest Episodes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Últimos Episódios
          </h2>
          <Link
            href="/episodios"
            className="inline-flex items-center gap-1 text-sm text-primary-yellow hover:text-primary-yellow-light transition-colors"
          >
            Ver todos
            <ArrowRight size={16} />
          </Link>
        </div>

        {latestEpisodes.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            Nenhum episódio disponível no momento.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestEpisodes.map((episode) => (
              <EpisodeCard key={episode.videoId} episode={episode} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
