import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import YouTubePlayer from "@/components/YouTubePlayer";
import CommentSection from "@/components/CommentSection";
import { getEpisodeById, getEpisodes } from "@/lib/youtube";

interface Props {
  params: Promise<{ videoId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { videoId } = await params;
  const episode = await getEpisodeById(videoId);

  if (!episode) {
    return { title: "Episódio não encontrado" };
  }

  return {
    title: episode.title,
    description: episode.description.slice(0, 160),
    openGraph: {
      title: episode.title,
      description: episode.description.slice(0, 160),
      images: [episode.thumbnail],
      type: "video.other",
    },
  };
}

export const revalidate = 600;

export async function generateStaticParams() {
  const episodes = await getEpisodes();
  return episodes.slice(0, 20).map((ep) => ({
    videoId: ep.videoId,
  }));
}

export default async function EpisodioPage({ params }: Props) {
  const { videoId } = await params;

  // Validate videoId format to prevent injection
  if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    notFound();
  }

  const episode = await getEpisodeById(videoId);

  if (!episode) {
    notFound();
  }

  const date = new Date(episode.publishedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link
        href="/episodios"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary-yellow transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Voltar aos episódios
      </Link>

      {/* Player */}
      <YouTubePlayer videoId={episode.videoId} title={episode.title} />

      {/* Episode Info */}
      <div className="mt-8 space-y-4">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
          {episode.title}
        </h1>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={14} />
          <time dateTime={episode.publishedAt}>{date}</time>
        </div>

        {episode.description && (
          <div className="bg-surface-card border border-surface-border rounded-xl p-6">
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {episode.description}
            </p>
          </div>
        )}
      </div>

      {/* Comments */}
      <div className="mt-12">
        <CommentSection videoId={episode.videoId} />
      </div>
    </div>
  );
}
