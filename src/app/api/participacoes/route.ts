import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/participacoes — list all participações (public, newest first)
export async function GET() {
  const participacoes = await prisma.participacao.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(participacoes);
}
