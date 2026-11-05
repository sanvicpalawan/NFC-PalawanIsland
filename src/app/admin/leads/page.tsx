import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { LeadsManager } from "@/components/admin/LeadsManager";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return <LeadsManager />;
}
