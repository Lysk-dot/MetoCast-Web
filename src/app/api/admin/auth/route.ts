import { NextRequest, NextResponse } from "next/server";

// POST /api/admin/auth — validate admin password
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { password } = body as { password?: string };
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ error: "Admin não configurado." }, { status: 503 });
  }

  if (!password || password !== adminPassword) {
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
