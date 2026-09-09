"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  getOverviewRevenueSeries,
  getWeeklyCompare,
  getOrderStatusDistribution,
  getPaymentDistribution,
} from "@/data/adminPortal";
import { useAdminWorkspace } from "@/context/AdminWorkspaceContext";
import { formatPkr } from "@/lib/formatCurrency";
import { Package, TrendingUp, CreditCard, AlertCircle } from "lucide-react";

const ACCENT = "#C9A227";
const ACCENT_LINE = "#8B6914";
const GRID = "#EDE4D8";
const AXIS = "#8B7355";

const STATUS_COLORS = ["#D4A574", "#8B6914", "#5C4033", "#6B8F71", "#A63D40"];
const PAY_COLORS = ["#3D7C47", "#C9A227", "#7C6BA8"];

function RevenueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { payload: { revenue: number; orders: number } }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded-lg border border-[#E8DFD4] bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-[#2B1A0F]">{label}</p>
      <p className="text-[#6B5344]">Revenue: {formatPkr(row.revenue)}</p>
      <p className="text-[#6B5344]">Orders: {row.orders}</p>
    </div>
  );
}

function PkrTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#E8DFD4] bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-[#2B1A0F]">{label}</p>
      <p className="tabular-nums text-[#4A3728]">{formatPkr(payload[0].value)}</p>
    </div>
  );
}

export default function AdminOverviewCharts() {
  const { orders } = useAdminWorkspace();

  const revenueSeries = useMemo(() => getOverviewRevenueSeries(orders), [orders]);
  const weeklyCompare = useMemo(() => getWeeklyCompare(orders), [orders]);
  const statusData = useMemo(() => getOrderStatusDistribution(orders), [orders]);
  const paymentData = useMemo(() => getPaymentDistribution(orders), [orders]);

  const deliveredCount = orders.filter(
    (o) => o.status === "delivered" || o.status === "shipped"
  ).length;
  const fulfillmentRate =
    orders.length > 0 ? Math.round((deliveredCount / orders.length) * 100) : 100;

  const pendingCount = orders.filter(
    (o) => o.status === "pending" || o.status === "processing"
  ).length;

  const codCount = orders.filter((o) => o.payment === "pending").length;
  const codShare =
    orders.length > 0 ? Math.round((codCount / orders.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Insight strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#E8DFD4]/90 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#6B5344]">
                Fulfillment Rate
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-[#1F1209]">
                {fulfillmentRate}%
              </p>
              <p className="mt-1 text-xs text-[#8B7355]">
                {deliveredCount} of {orders.length} orders dispatched/delivered
              </p>
            </div>
            <Package className="h-8 w-8 shrink-0 text-[#C9A227]/90" strokeWidth={1.5} />
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F0E8DC]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#8B6914] to-[#F2C27B]"
              style={{ width: `${fulfillmentRate}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-[#E8DFD4]/90 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#6B5344]">
                Awaiting Dispatch
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-[#1F1209]">
                {pendingCount}
              </p>
              <p className="mt-1 text-xs text-[#8B7355]">
                Orders ready to pack & ship
              </p>
            </div>
            <TrendingUp className="h-8 w-8 shrink-0 text-[#6B8F71]" strokeWidth={1.5} />
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F0E8DC]">
            <div
              className="h-full rounded-full bg-[#6B8F71]/85"
              style={{
                width: `${orders.length > 0 ? (pendingCount / orders.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-[#E8DFD4]/90 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#6B5344]">
                Cash on Delivery
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-[#1F1209]">
                {codShare}%
              </p>
              <p className="mt-1 text-xs text-[#8B7355]">
                {codCount} COD order(s) pending courier collection
              </p>
            </div>
            <CreditCard className="h-8 w-8 shrink-0 text-[#4A2F19]" strokeWidth={1.5} />
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F0E8DC]">
            <div
              className="h-full rounded-full bg-[#4A2F19]/85"
              style={{ width: `${codShare}%` }}
            />
          </div>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-6 xl:grid-cols-5">
        <section className="rounded-xl border border-[#E8DFD4]/90 bg-white shadow-sm xl:col-span-3">
          <div className="border-b border-[#EDE4D8] px-5 py-4">
            <h3 className="text-base font-semibold text-[#1F1209]">
              Revenue & orders (7-day trend)
            </h3>
            <p className="mt-1 text-xs text-[#6B5344]">
              Daily order totals and sales performance over the past week.
            </p>
          </div>
          <div className="h-[300px] w-full px-2 pb-4 pt-2 sm:px-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ACCENT} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: AXIS, fontSize: 11 }}
                  axisLine={{ stroke: GRID }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) =>
                    v >= 1_000_000
                      ? `${(v / 1_000_000).toFixed(1)}M`
                      : v >= 1000
                      ? `${Math.round(v / 1000)}k`
                      : `${v}`
                  }
                  tick={{ fill: AXIS, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                />
                <Tooltip content={<RevenueTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={ACCENT_LINE}
                  strokeWidth={2}
                  fill="url(#adminRevGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-[#E8DFD4]/90 bg-white shadow-sm xl:col-span-2">
          <div className="border-b border-[#EDE4D8] px-5 py-4">
            <h3 className="text-base font-semibold text-[#1F1209]">
              Orders by status
            </h3>
            <p className="mt-1 text-xs text-[#6B5344]">
              Live breakdown of order fulfillment pipeline.
            </p>
          </div>
          <div className="h-[300px] w-full px-2 pb-2 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="48%"
                  innerRadius={54}
                  outerRadius={82}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} stroke="#fff" strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [value, name]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E8DFD4",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={42}
                  formatter={(value) => (
                    <span className="text-xs text-[#4A3728]">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-[#E8DFD4]/90 bg-white shadow-sm">
          <div className="border-b border-[#EDE4D8] px-5 py-4">
            <h3 className="text-base font-semibold text-[#1F1209]">
              Daily order volume
            </h3>
            <p className="mt-1 text-xs text-[#6B5344]">
              Number of customer orders received per day.
            </p>
          </div>
          <div className="h-[260px] w-full px-2 pb-4 pt-2 sm:px-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: AXIS, fontSize: 11 }} axisLine={{ stroke: GRID }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: AXIS, fontSize: 11 }} width={28} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value: number) => [`${value} orders`, "Volume"]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E8DFD4",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="orders" fill="#4A2F19" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-[#E8DFD4]/90 bg-white shadow-sm">
          <div className="border-b border-[#EDE4D8] px-5 py-4">
            <h3 className="text-base font-semibold text-[#1F1209]">
              Revenue by week (distribution)
            </h3>
            <p className="mt-1 text-xs text-[#6B5344]">
              Weekly performance indicators.
            </p>
          </div>
          <div className="h-[260px] w-full px-2 pb-4 pt-2 sm:px-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyCompare} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
                <XAxis dataKey="week" tick={{ fill: AXIS, fontSize: 11 }} axisLine={{ stroke: GRID }} tickLine={false} />
                <YAxis
                  tickFormatter={(v) =>
                    v >= 1_000_000
                      ? `${(v / 1_000_000).toFixed(1)}M`
                      : v >= 1000
                      ? `${Math.round(v / 1000)}k`
                      : `${v}`
                  }
                  tick={{ fill: AXIS, fontSize: 11 }}
                  width={40}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<PkrTooltip />} />
                <Bar dataKey="revenue" fill="#C9A227" radius={[6, 6, 0, 0]} maxBarSize={56} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Payment mix + alerts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-[#E8DFD4]/90 bg-white shadow-sm lg:col-span-1">
          <div className="border-b border-[#EDE4D8] px-5 py-4">
            <h3 className="text-base font-semibold text-[#1F1209]">Payment mix</h3>
            <p className="mt-1 text-xs text-[#6B5344]">Settlement status across orders</p>
          </div>
          <div className="h-[220px] w-full px-2 pb-4 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={72}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
                  }
                  labelLine={{ stroke: AXIS }}
                >
                  {paymentData.map((_, i) => (
                    <Cell key={i} fill={PAY_COLORS[i % PAY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [v, "Orders"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-5 shadow-sm lg:col-span-2">
          <div className="flex gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" strokeWidth={2} />
            <div>
              <h3 className="font-semibold text-amber-950">Store Operational Alerts</h3>
              <ul className="mt-3 space-y-2 text-sm text-amber-950/85">
                <li className="flex gap-2">
                  <span className="font-medium text-amber-900">Orders:</span>
                  <span>
                    {pendingCount > 0
                      ? `${pendingCount} order(s) currently awaiting fulfillment and dispatch.`
                      : "All orders fulfilled and up to date."}
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-amber-900">Settlements:</span>
                  <span>
                    {codCount > 0
                      ? `${codCount} Cash on Delivery order(s) awaiting courier remittance.`
                      : "No pending COD settlements."}
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-amber-900">Catalogue:</span>
                  <span>
                    Core maison collections (Tissot, Rolex, Patek, TAG Heuer, Hublot) active in Supabase.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
