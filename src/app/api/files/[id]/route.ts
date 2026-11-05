import { NextResponse } from "next/server";
import { db } from "@/db";
import { uploadedFiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Serves a file that was uploaded through the admin CMS.
 *
 * Files live in the database (see `uploadedFiles` in src/db/schema.ts), so this
 * route is the only way they reach a browser. URLs are immutable — the row is
 * never rewritten — which is why the response can be cached indefinitely.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return new NextResponse("Not found", { status: 404 });
  }

  const rows = await db
    .select()
    .from(uploadedFiles)
    .where(eq(uploadedFiles.id, numericId))
    .limit(1);

  const file = rows[0];
  if (!file) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(file.data), {
    status: 200,
    headers: {
      "Content-Type": file.mimeType,
      "Content-Length": String(file.fileSize),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
