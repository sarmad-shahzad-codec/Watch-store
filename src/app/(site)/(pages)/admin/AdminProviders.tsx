"use client";

import type { ReactNode } from "react";
import { AdminWorkspaceProvider } from "@/context/AdminWorkspaceContext";

export default function AdminProviders({ children }: { children: ReactNode }) {
  return <AdminWorkspaceProvider>{children}</AdminWorkspaceProvider>;
}
