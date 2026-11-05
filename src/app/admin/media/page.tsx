import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { MediaManager } from "@/components/admin/MediaManager";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return <MediaManager />;
}
