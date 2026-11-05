import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { ProductsManager } from "@/components/admin/ProductsManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return <ProductsManager />;
}
