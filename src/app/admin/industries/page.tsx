import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { IndustriesManager } from "@/components/admin/IndustriesManager";

export const dynamic = "force-dynamic";

export default async function AdminIndustriesPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return <IndustriesManager />;
}
