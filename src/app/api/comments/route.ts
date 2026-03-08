import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/comments?videoId=xxx
export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("videoId");

  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return NextResponse.json({ error: "videoId inválido." }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { videoId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(comments);
}

// POST /api/comments
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { videoId, author, message } = body as {
    videoId?: string;
    author?: string;
    message?: string;
  };

  // Validation
  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return NextResponse.json({ error: "videoId inválido." }, { status: 400 });
  }

  if (!author || typeof author !== "string" || author.trim().length === 0 || author.trim().length > 100) {
    return NextResponse.json({ error: "Nome inválido (máx. 100 caracteres)." }, { status: 400 });
  }

  if (!message || typeof message !== "string" || message.trim().length === 0 || message.trim().length > 2000) {
    return NextResponse.json({ error: "Mensagem inválida (máx. 2000 caracteres)." }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      videoId,
      author: author.trim(),
      message: message.trim(),
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
