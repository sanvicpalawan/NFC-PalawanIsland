import { cookies } from "next/headers";
import { db } from "@/db";
import { admins, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export const COOKIE_NAME = "nfc_palawan_admin_session";

const MIN_SECRET_LENGTH = 32;

/**
 * Session signing key.
 *
 * Supplied only by the environment. There is deliberately no fallback value, so
 * a deployment can never issue or verify sessions against a published default.
 */
function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `ADMIN_SESSION_SECRET must be set to a random string of at least ${MIN_SECRET_LENGTH} characters.`
    );
  }
  return secret;
}

export interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: "owner" | "admin" | "editor" | "viewer";
}

// Generate a secure signed token
export function createSessionToken(user: SessionUser): string {
  const payload = JSON.stringify({
    ...user,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  });
  const encodedPayload = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

// Verify signed token
export function verifySessionToken(token: string): SessionUser | null {
  try {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", getSessionSecret())
      .update(encodedPayload)
      .digest("base64url");

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

/**
 * Development bypass.
 *
 * Set ADMIN_AUTH_DISABLED=true to skip the login screen entirely while working
 * locally: every request is then treated as an owner session.
 *
 * The flag has no effect in a production build, so it cannot be switched on for
 * a public deployment. Set ADMIN_AUTH_DISABLED=false (or unset it) and sign-in
 * is required again.
 */
export function isAuthBypassed(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.ADMIN_AUTH_DISABLED === "true"
  );
}

const BYPASS_USER: SessionUser = {
  id: 0,
  email: "dev@localhost",
  name: "Development Session",
  role: "owner",
};

// Get current admin from Next.js cookies
export async function getCurrentAdmin(): Promise<SessionUser | null> {
  if (isAuthBypassed()) return BYPASS_USER;

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

// Check role permissions:
// owner: all operations
// admin: all operations except deleting owners
// editor: create/edit/publish content, cannot delete or change site settings / admins
// viewer: read-only access
export function canPerformAction(
  role: string,
  action: "read" | "create" | "update" | "publish" | "delete" | "manage_users" | "settings"
): boolean {
  if (role === "owner") return true;
  if (role === "admin") {
    return action !== "manage_users"; // can do all except manage owner accounts
  }
  if (role === "editor") {
    return ["read", "create", "update", "publish"].includes(action);
  }
  if (role === "viewer") {
    return action === "read";
  }
  return false;
}

// Record an audit log entry
export async function logAudit({
  adminEmail,
  adminName,
  action,
  entityType,
  entityId,
  details,
}: {
  adminEmail: string;
  adminName: string;
  action: "create" | "update" | "delete" | "publish" | "archive" | "restore" | "login" | "export";
  entityType: "page" | "industry" | "use_case" | "product" | "lead" | "setting" | "media" | "admin";
  entityId?: string;
  details: string;
}) {
  try {
    await db.insert(auditLogs).values({
      adminEmail,
      adminName,
      action,
      entityType,
      entityId: entityId || null,
      details,
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}
