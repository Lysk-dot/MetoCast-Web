import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
          rows.map((r: any) => ({ path: r.path, count: r._count.path }))
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

  return NextResponse.json({
    totalPageViews,
    uniqueSessions,
    topPages,
    totalVideoViews,
    totalWatchMinutes,
    topVideos: videoStats,
  });
}
