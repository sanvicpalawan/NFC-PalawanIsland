import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { TeamManager } from "@/components/admin/TeamManager";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return <TeamManager />;
}
