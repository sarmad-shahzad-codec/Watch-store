import type { ReactNode } from "react";
import AdminShell from "@/components/Admin/AdminShell";
import AdminProviders from "./AdminProviders";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProviders>
      <AdminShell>{children}</AdminShell>
    </AdminProviders>
  );
}
