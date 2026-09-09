"use client";

import Link from "next/link";
import { getDashboardStats } from "@/data/adminPortal";
import { useAdminWorkspace } from "@/context/AdminWorkspaceContext";
import StatCard from "@/components/Admin/StatCard";
import AdminOverviewCharts from "@/components/Admin/AdminOverviewCharts";
import { formatPkr } from "@/lib/formatCurrency";
import { orderStatusClass } from "@/components/Admin/statusStyles";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  TrendingUp,
} from "lucide-react";

export default function AdminOverviewPage() {
  const { orders, loadingOrders, refreshOrders } = useAdminWorkspace();
  const stats = getDashboardStats(orders);
  const recent = [...orders].sort(
    (a, b) =>
      new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
  ).slice(0, 5);

  const fmtDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? "—"
      : d.toLocaleString("en-PK", {
          dateStyle: "medium",
          timeStyle: "short",
        });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-[#6B5344]">
            Real-time store operations and live order fulfillment from Supabase.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refreshOrders()}
          disabled={loadingOrders}
          className="self-start sm:self-auto min-h-[38px] px-3.5 py-1.5 rounded-lg border border-[#EDE4D8] bg-white text-xs font-semibold uppercase tracking-wider text-[#4A2F19] hover:bg-[#FAF8F5] transition shadow-sm"
        >
          {loadingOrders ? "Syncing..." : "Sync live data"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total revenue"
          value={formatPkr(stats.revenue)}
          hint="Gross sales from confirmed orders"
          icon={DollarSign}
          trend="up"
          trendLabel="Active orders"
          accent="green"
        />
        <StatCard
          title="Total orders"
          value={String(stats.orderCount)}
          hint="Customer orders in Supabase"
          icon={ShoppingBag}
          trend={stats.orderCount > 0 ? "up" : "flat"}
          trendLabel={stats.orderCount > 0 ? "Orders received" : "No orders yet"}
          accent="default"
        />
        <StatCard
          title="Awaiting fulfillment"
          value={String(stats.pendingFulfillment)}
          hint="Pending + processing"
          icon={Clock}
          trend={stats.pendingFulfillment > 0 ? "flat" : "up"}
          trendLabel={stats.pendingFulfillment > 0 ? "Needs attention" : "All fulfilled"}
          accent="amber"
        />
        <StatCard
          title="Avg. order value"
          value={formatPkr(stats.avgOrder)}
          hint="Average spend per order"
          icon={TrendingUp}
          trend="up"
          trendLabel="Per order"
          accent="blue"
        />
      </div>

      <AdminOverviewCharts />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-xl border border-[#E8DFD4]/90 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDE4D8] px-5 py-4">
            <h2 className="text-lg font-semibold text-[#1F1209]">
              Recent orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-[#4A2F19] underline-offset-2 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#EDE4D8] bg-[#FAF8F5]/80 text-[11px] uppercase tracking-[0.12em] text-[#6B5344]">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loadingOrders && orders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-sm text-[#8B7355]">
                      Connecting to Supabase and loading live orders...
                    </td>
                  </tr>
                ) : recent.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-sm text-[#8B7355]">
                      No orders placed yet. Live customer orders will appear here automatically.
                    </td>
                  </tr>
                ) : (
                  recent.map((o) => (
                    <tr
                      key={o.id}
                      className="border-b border-[#F0E8DC] last:border-0"
                    >
                      <td className="px-5 py-3.5 font-semibold text-[#2B1A0F]">
                        {o.id}
                      </td>
                      <td className="px-5 py-3.5 text-[#4A3728]">
                        <span className="block font-medium">{o.customerName}</span>
                        <span className="text-xs text-[#8B7355]">
                          {o.customerEmail}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 tabular-nums font-semibold text-[#1F1209]">
                        {formatPkr(o.totalPkr)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${orderStatusClass(o.status)}`}
                        >
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="space-y-4 rounded-xl border border-[#E8DFD4]/90 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1F1209]">Shortcuts</h2>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link
                className="block rounded-lg border border-[#EDE4D8] px-4 py-3 font-medium text-[#2B1A0F] transition hover:bg-[#FAF8F5]"
                href="/admin/orders"
              >
                Manage all orders
              </Link>
            </li>
            <li>
              <Link
                className="block rounded-lg border border-[#EDE4D8] px-4 py-3 font-medium text-[#2B1A0F] transition hover:bg-[#FAF8F5]"
                href="/admin/products"
              >
                Manage catalogue
              </Link>
            </li>
            <li>
              <Link
                className="block rounded-lg border border-[#EDE4D8] px-4 py-3 font-medium text-[#2B1A0F] transition hover:bg-[#FAF8F5]"
                href="/admin/customers"
              >
                Customer records
              </Link>
            </li>
            <li>
              <Link
                className="block rounded-lg border border-[#EDE4D8] px-4 py-3 font-medium text-[#2B1A0F] transition hover:bg-[#FAF8F5]"
                href="/admin/finances"
              >
                Finance & profit margins
              </Link>
            </li>
          </ul>
          <div className="rounded-lg bg-[#FAF8F5] p-4 text-xs leading-relaxed text-[#6B5344]">
            <p className="font-semibold text-[#4A2F19]">Payments status</p>
            <p className="mt-1">
              {stats.awaitingPayment} order(s) currently pending Cash on Delivery settlement.
            </p>
          </div>
          <div className="border-t border-[#EDE4D8] pt-4 text-xs text-[#8B7355]">
            Last refresh: {fmtDate(recent[0]?.placedAt ?? new Date().toISOString())}
          </div>
        </aside>
      </div>
    </div>
  );
}
