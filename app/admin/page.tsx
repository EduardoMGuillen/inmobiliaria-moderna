import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Admin | ${BRAND.name}`,
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-surface py-10 px-4">
      <AdminPanel />
    </div>
  );
}
