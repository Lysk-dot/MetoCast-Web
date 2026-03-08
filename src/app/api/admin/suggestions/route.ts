import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function checkAuth(request: NextRequest): boolean {
  const password = request.headers.get("x-admin-password");
  return !!password && password === process.env.ADMIN_PASSWORD;
}

// GET /api/admin/suggestions — list all suggestions (admin)
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const suggestions = await prisma.suggestion.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json(suggestions);
}

// DELETE /api/admin/suggestions?id=123 — delete a suggestion
export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const id = parseInt(request.nextUrl.searchParams.get("id") || "", 10);
  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  try {
    await prisma.suggestion.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Sugestão não encontrada." }, { status: 404 });
  }
}
