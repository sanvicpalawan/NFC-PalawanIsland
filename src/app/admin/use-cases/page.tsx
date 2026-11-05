import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { UseCasesManager } from "@/components/admin/UseCasesManager";

export const dynamic = "force-dynamic";

export default async function AdminUseCasesPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return <UseCasesManager />;
}
