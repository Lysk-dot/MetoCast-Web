import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

function checkAuth(request: NextRequest): boolean {
  const password = request.headers.get("x-admin-password");
  return !!password && password === process.env.ADMIN_PASSWORD;
}

// POST /api/admin/upload — upload a photo or video
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Tipo de arquivo não permitido. Use JPG, PNG, WebP, GIF, MP4 ou WebM." },
      { status: 400 }
    );
  }

  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

  if (file.size > maxSize) {
    return NextResponse.json(
      { error: `Arquivo muito grande. Máximo: ${isVideo ? "100MB" : "10MB"}.` },
      { status: 400 }
    );
  }

  // Generate a secure random filename to prevent path traversal
  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const safeExt = ext.slice(0, 5);
  const randomName = crypto.randomBytes(16).toString("hex");
  const filename = `${randomName}.${safeExt}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads", "participacoes");
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  const url = `/uploads/participacoes/${filename}`;

  return NextResponse.json({ url, type: isVideo ? "video" : "image" }, { status: 201 });
}
