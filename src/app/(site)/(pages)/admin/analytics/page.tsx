"use client";

import { getDashboardStats } from "@/data/adminPortal";
import { formatPkr } from "@/lib/formatCurrency";
import StatCard from "@/components/Admin/StatCard";
import { useAdminWorkspace } from "@/context/AdminWorkspaceContext";

export default function AdminAnalyticsPage() {
  const { orders } = useAdminWorkspace();
  const s = getDashboardStats(orders);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-[#1F1209]">Analytics</h2>
        <p className="mt-1 text-sm text-[#6B5344]">
          Store key performance indicators and revenue metrics derived from Supabase.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={formatPkr(s.revenue)} hint="Gross sales" />
        <StatCard title="Total Orders" value={String(s.orderCount)} hint="Confirmed orders" />
        <StatCard title="Avg. Order Value" value={formatPkr(s.avgOrder)} hint="Per order" />
        <StatCard
          title="Fulfillment Status"
          value={`${s.orderCount > 0 ? Math.round(((s.orderCount - s.pendingFulfillment) / s.orderCount) * 100) : 100}%`}
          hint="Dispatched or delivered"
        />
      </div>

      <section className="rounded-xl border border-[#EDE4D8] bg-white p-8 shadow-sm">
        <h3 className="text-base font-semibold text-[#1F1209]">
          Store Traffic & Conversion
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#6B5344]">
          Real-time conversion tracking across Gloria Times Pakistan. Orders are automatically logged into Supabase upon checkout confirmation.
        </p>
      </section>
    </div>
  );
}
