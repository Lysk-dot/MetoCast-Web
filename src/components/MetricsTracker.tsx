"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function getSessionId(): string {
  const key = "metocast-session";
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(key, sid);
  }
  return sid;
}

export default function MetricsTracker() {
  const pathname = usePathname();
  const tracked = useRef<string>("");

  useEffect(() => {
    if (tracked.current === pathname) return;
    tracked.current = pathname;

    const sessionId = getSessionId();
    fetch("/api/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "pageview", path: pathname, sessionId }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}

// Helper for video tracking — call from YouTubePlayer
export function trackVideoView(videoId: string, watchSeconds: number) {
  const sessionId = sessionStorage.getItem("metocast-session") || "unknown";
  fetch("/api/metrics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "videoview", videoId, sessionId, watchSeconds }),
  }).catch(() => {});
}
