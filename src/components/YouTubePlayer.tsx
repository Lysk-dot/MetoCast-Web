"use client";

import { useEffect, useRef } from "react";
import { trackVideoView } from "./MetricsTracker";

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
}

export default function YouTubePlayer({ videoId, title = "" }: YouTubePlayerProps) {
  const startRef = useRef<number | null>(null);
  const totalRef = useRef(0);

  useEffect(() => {
    // Track accumulated watch time when leaving the page
    return () => {
      const total = totalRef.current + (startRef.current ? Math.round((Date.now() - startRef.current) / 1000) : 0);
      if (total > 0) {
        trackVideoView(videoId, total);
      }
    };
  }, [videoId]);

  // Use IntersectionObserver as a proxy: assume video is watched while in viewport
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const el = iframeRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startRef.current = Date.now();
        } else if (startRef.current) {
          totalRef.current += Math.round((Date.now() - startRef.current) / 1000);
          startRef.current = null;
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-surface-card">
      <iframe
        ref={iframeRef}
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
