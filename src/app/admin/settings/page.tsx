import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { SettingsManager } from "@/components/admin/SettingsManager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return <SettingsManager />;
}
