"use client";

import { useMemo } from "react";
import { getCustomersFromOrders } from "@/data/adminPortal";
import { useAdminWorkspace } from "@/context/AdminWorkspaceContext";
import { formatPkr } from "@/lib/formatCurrency";

export default function AdminCustomersPage() {
  const { orders, loadingOrders } = useAdminWorkspace();
  const customers = useMemo(() => getCustomersFromOrders(orders), [orders]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1F1209]">Customers</h2>
        <p className="mt-1 text-sm text-[#6B5344]">
          Customer purchase history and lifetime value derived from Supabase orders.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E8DFD4]/90 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#EDE4D8] bg-[#FAF8F5]/90 text-[11px] uppercase tracking-[0.12em] text-[#6B5344]">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone / Email</th>
                <th className="px-4 py-3 font-medium">Orders</th>
                <th className="px-4 py-3 font-medium">Lifetime value</th>
                <th className="px-4 py-3 font-medium">First Ordered</th>
              </tr>
            </thead>
            <tbody>
              {loadingOrders && customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#8B7355]">
                    Loading customer records from Supabase...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#8B7355]">
                    No customer records yet. Customers who place orders will appear here automatically.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="border-b border-[#F0E8DC] last:border-0">
                    <td className="px-4 py-3.5 font-medium text-[#2B1A0F]">
                      {c.name}
                    </td>
                    <td className="px-4 py-3.5 text-[#6B5344]">{c.email}</td>
                    <td className="px-4 py-3.5 tabular-nums">{c.orders}</td>
                    <td className="px-4 py-3.5 tabular-nums font-semibold text-[#1F1209]">
                      {formatPkr(c.lifetimePkr)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-[#4A3728]">
                      {c.joined
                        ? new Date(c.joined).toLocaleDateString("en-PK", {
                            dateStyle: "medium",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
