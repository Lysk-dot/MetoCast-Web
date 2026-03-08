interface YouTubePlayerProps {
  videoId: string;
  title?: string;
}

export default function YouTubePlayer({ videoId, title = "" }: YouTubePlayerProps) {
  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-surface-card">
      <iframe
        src={`https://www.youtube.com/embed/${encodeURIComponent(videoId)}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        loading="lazy"
      />
    </div>
  );
}
