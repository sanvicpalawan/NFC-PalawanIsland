import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { PagesManager } from "@/components/admin/PagesManager";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return <PagesManager />;
}
