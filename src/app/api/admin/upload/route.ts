import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { db } from "@/db";
import { mediaItems, uploadedFiles } from "@/db/schema";

export const dynamic = "force-dynamic";

const ALLOWED_IMAGE = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);
const ALLOWED_PDF = new Set(["application/pdf"]);
const ALLOWED = new Set([...ALLOWED_IMAGE, ...ALLOWED_PDF]);

const MAX_BYTES = 8 * 1024 * 1024;

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

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = (file.name || "upload").slice(0, 255);

    // Store the bytes in the database and hand back a stable URL. Writing to
    // `public/uploads` would fail on a serverless host and the file would not
    // be served even if it succeeded.
    const inserted = await db
      .insert(uploadedFiles)
      .values({
        fileName,
        mimeType: file.type,
        fileSize: buffer.length,
        data: buffer,
      })
      .returning({ id: uploadedFiles.id });

    const url = `/api/files/${inserted[0].id}`;

    // Register it in the media library so it is visible and reusable. A
    // failure here must not lose the upload itself.
    try {
      await db.insert(mediaItems).values({
        fileName,
        url,
        fileSize: buffer.length,
        mimeType: file.type,
        altText: null,
        category: "upload",
      });
    } catch (registerError) {
      console.error("media registration failed (file stored)", registerError);
    }

    return NextResponse.json({
      success: true,
      url,
      fileName,
      mimeType: file.type,
      size: buffer.length,
    });
  } catch (e: any) {
    console.error("upload error", e);
    return NextResponse.json({ error: e.message || "Upload failed" }, { status: 500 });
  }
}
