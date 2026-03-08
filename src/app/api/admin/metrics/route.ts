import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEpisodes } from "@/lib/youtube";

const PAGE_NAMES: Record<string, string> = {
  "/": "Início",
  "/episodios": "Episódios",
  "/assistir": "Assistir",
  "/sobre": "Sobre",
  "/comunidade": "Comunidade",
  "/admin": "Painel Admin",
};

function checkAuth(request: NextRequest): boolean {
  const password = request.headers.get("x-admin-password");
  return !!password && password === process.env.ADMIN_PASSWORD;
}

// GET /api/admin/metrics — get metrics summary
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const db = prisma as any;

  const [totalPageViews, uniqueSessions, topPages, totalVideoViews, videoStats] =
    await Promise.all([
      db.pageView.count(),
      db.pageView
        .groupBy({ by: ["sessionId"] })
        .then((r: any[]) => r.length),
      db.pageView
        .groupBy({
          by: ["path"],
          _count: { path: true },
          orderBy: { _count: { path: "desc" } },
          take: 10,
        })
        .then((rows: any[]) =>
          rows.map((r: any) => ({
            path: r.path,
            name: PAGE_NAMES[r.path] || (r.path.startsWith("/episodio/") ? "Episódio" : r.path),
            count: r._count.path,
          }))
        ),
      db.videoView.count(),
      db.videoView
        .groupBy({
          by: ["videoId"],
          _count: { videoId: true },
          _sum: { watchSeconds: true },
          orderBy: { _count: { videoId: "desc" } },
          take: 10,
        })
        .then((rows: any[]) =>
          rows.map((r: any) => ({
            videoId: r.videoId,
            views: r._count.videoId,
            minutes: Math.round((r._sum.watchSeconds || 0) / 60),
          }))
        ),
    ]);

  const totalWatchMinutes = await db.videoView
    .aggregate({ _sum: { watchSeconds: true } })
    .then((r: any) => Math.round((r._sum.watchSeconds || 0) / 60));

  // Resolve video titles from YouTube RSS
  let episodes: { videoId: string; title: string }[] = [];
  try {
    episodes = await getEpisodes();
  } catch { /* ignore */ }
  const titleMap = new Map(episodes.map((e) => [e.videoId, e.title]));

  const topVideos = videoStats.map((v: any) => ({
    ...v,
    title: titleMap.get(v.videoId) || v.videoId,
  }));

  return NextResponse.json({
    totalPageViews,
    uniqueSessions,
    topPages,
    totalVideoViews,
    totalWatchMinutes,
    topVideos,
  });
}
