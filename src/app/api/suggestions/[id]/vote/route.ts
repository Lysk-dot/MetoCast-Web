import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/suggestions/[id]/vote
export async function POST(_request: Request, context: RouteContext) {
  const { id: idStr } = await context.params;
  const id = parseInt(idStr, 10);

  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  try {
    const suggestion = await prisma.suggestion.update({
      where: { id },
      data: { votes: { increment: 1 } },
    });

    return NextResponse.json(suggestion);
  } catch {
    return NextResponse.json({ error: "Sugestão não encontrada." }, { status: 404 });
  }
}
