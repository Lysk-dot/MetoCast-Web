import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* eslint-disable @typescript-eslint/no-explicit-any */
const db = prisma as any;

// POST /api/metrics — track page view or video view
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { type, path, videoId, watchSeconds, sessionId } = body as {
    type?: string;
    path?: string;
    videoId?: string;
    watchSeconds?: number;
    sessionId?: string;
  };

  if (!sessionId || typeof sessionId !== "string" || sessionId.length > 100) {
    return NextResponse.json({ error: "sessionId inválido." }, { status: 400 });
  }

  if (type === "pageview") {
    if (!path || typeof path !== "string" || path.length > 500) {
      return NextResponse.json({ error: "path inválido." }, { status: 400 });
    }

    await db.pageView.create({
      data: { path, sessionId },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  }

  if (type === "videoview") {
    if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return NextResponse.json({ error: "videoId inválido." }, { status: 400 });
    }

    const seconds = Math.max(0, Math.min(Number(watchSeconds) || 0, 86400));

    await db.videoView.create({
      data: { videoId, sessionId, watchSeconds: seconds },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  }

  return NextResponse.json({ error: "type inválido." }, { status: 400 });
}
