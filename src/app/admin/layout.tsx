import { ReactNode } from "react";
import Link from "next/link";
import { getCurrentAdmin, isAuthBypassed } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await getCurrentAdmin();
  const authBypassed = isAuthBypassed();

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col md:flex-row">
      <AdminNav initialAdmin={admin} authBypassed={authBypassed} />
      <div className="flex-1 flex flex-col overflow-x-hidden min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
