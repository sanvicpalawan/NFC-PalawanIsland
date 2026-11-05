import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

const ALLOWED_IMAGE = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);
const ALLOWED_PDF = new Set(["application/pdf"]);
const ALLOWED = new Set([...ALLOWED_IMAGE, ...ALLOWED_PDF]);

function sanitize(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Allowed: images and PDF.` },
        { status: 400 }
      );
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || (file.type === "image/jpeg" ? ".jpg" : file.type === "application/pdf" ? ".pdf" : ".bin");
    const base = sanitize(path.basename(file.name, ext)) || "upload";
    const fname = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const fullPath = path.join(uploadDir, fname);
    await fs.writeFile(fullPath, buffer);

    const url = `/uploads/${fname}`;

    return NextResponse.json({
      success: true,
      url,
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
    });
  } catch (e: any) {
    console.error("upload error", e);
    return NextResponse.json({ error: e.message || "Upload failed" }, { status: 500 });
  }
}
