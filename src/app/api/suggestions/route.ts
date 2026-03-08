import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/suggestions
export async function GET() {
  const suggestions = await prisma.suggestion.findMany({
    orderBy: { votes: "desc" },
    take: 50,
  });

  return NextResponse.json(suggestions);
}

// POST /api/suggestions
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { author, title, description } = body as {
    author?: string;
    title?: string;
    description?: string;
  };

  // Validation
  if (!author || typeof author !== "string" || author.trim().length === 0 || author.trim().length > 100) {
    return NextResponse.json({ error: "Nome inválido (máx. 100 caracteres)." }, { status: 400 });
  }

  if (!title || typeof title !== "string" || title.trim().length === 0 || title.trim().length > 200) {
    return NextResponse.json({ error: "Título inválido (máx. 200 caracteres)." }, { status: 400 });
  }

  if (!description || typeof description !== "string" || description.trim().length === 0 || description.trim().length > 2000) {
    return NextResponse.json({ error: "Descrição inválida (máx. 2000 caracteres)." }, { status: 400 });
  }

  const suggestion = await prisma.suggestion.create({
    data: {
      author: author.trim(),
      title: title.trim(),
      description: description.trim(),
    },
  });

  return NextResponse.json(suggestion, { status: 201 });
}
