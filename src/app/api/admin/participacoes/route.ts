import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function checkAuth(request: NextRequest): boolean {
  const password = request.headers.get("x-admin-password");
  return !!password && password === process.env.ADMIN_PASSWORD;
}

// GET /api/admin/participacoes — list all (admin)
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const participacoes = await prisma.participacao.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json(participacoes);
}

// POST /api/admin/participacoes — create a new participação
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { nome, cargo, episodio, videoId, data, fotoUrl, videoUrl } = body as {
    nome?: string;
    cargo?: string;
    episodio?: string;
    videoId?: string;
    data?: string;
    fotoUrl?: string;
    videoUrl?: string;
  };

  if (!nome || nome.length > 200) {
    return NextResponse.json({ error: "Nome é obrigatório (máx. 200 caracteres)." }, { status: 400 });
  }
  if (!cargo || cargo.length > 300) {
    return NextResponse.json({ error: "Cargo é obrigatório (máx. 300 caracteres)." }, { status: 400 });
  }
  if (!episodio || episodio.length > 300) {
    return NextResponse.json({ error: "Episódio é obrigatório (máx. 300 caracteres)." }, { status: 400 });
  }
  if (!data || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return NextResponse.json({ error: "Data é obrigatória (formato YYYY-MM-DD)." }, { status: 400 });
  }
  if (videoId && !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return NextResponse.json({ error: "ID de vídeo inválido." }, { status: 400 });
  }
  if (fotoUrl && fotoUrl.length > 1000) {
    return NextResponse.json({ error: "URL da foto muito longa." }, { status: 400 });
  }
  if (videoUrl && videoUrl.length > 1000) {
    return NextResponse.json({ error: "URL do vídeo muito longa." }, { status: 400 });
  }

  const participacao = await prisma.participacao.create({
    data: {
      nome: nome.trim(),
      cargo: cargo.trim(),
      episodio: episodio.trim(),
      videoId: videoId?.trim() || null,
      data,
      fotoUrl: fotoUrl?.trim() || null,
      videoUrl: videoUrl?.trim() || null,
    },
  });

  return NextResponse.json(participacao, { status: 201 });
}

// PUT /api/admin/participacoes — update a participação
export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { id, nome, cargo, episodio, videoId, data, fotoUrl, videoUrl } = body as {
    id?: number;
    nome?: string;
    cargo?: string;
    episodio?: string;
    videoId?: string | null;
    data?: string;
    fotoUrl?: string | null;
    videoUrl?: string | null;
  };

  if (!id || typeof id !== "number") {
    return NextResponse.json({ error: "ID é obrigatório." }, { status: 400 });
  }
  if (!nome || nome.length > 200) {
    return NextResponse.json({ error: "Nome é obrigatório (máx. 200 caracteres)." }, { status: 400 });
  }
  if (!cargo || cargo.length > 300) {
    return NextResponse.json({ error: "Cargo é obrigatório (máx. 300 caracteres)." }, { status: 400 });
  }
  if (!episodio || episodio.length > 300) {
    return NextResponse.json({ error: "Episódio é obrigatório (máx. 300 caracteres)." }, { status: 400 });
  }
  if (!data || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return NextResponse.json({ error: "Data é obrigatória (formato YYYY-MM-DD)." }, { status: 400 });
  }
  if (videoId && !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return NextResponse.json({ error: "ID de vídeo inválido." }, { status: 400 });
  }

  try {
    const participacao = await prisma.participacao.update({
      where: { id },
      data: {
        nome: nome.trim(),
        cargo: cargo.trim(),
        episodio: episodio.trim(),
        videoId: videoId?.trim() || null,
        data,
        fotoUrl: fotoUrl?.trim() || null,
        videoUrl: videoUrl?.trim() || null,
      },
    });

    return NextResponse.json(participacao);
  } catch {
    return NextResponse.json({ error: "Participação não encontrada." }, { status: 404 });
  }
}

// DELETE /api/admin/participacoes?id=123 — delete a participação
export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const id = parseInt(request.nextUrl.searchParams.get("id") || "", 10);
  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  try {
    await prisma.participacao.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Participação não encontrada." }, { status: 404 });
  }
}
