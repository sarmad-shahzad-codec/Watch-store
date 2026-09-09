"use client";

import type { ComponentType } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  trend,
  trendLabel,
  accent = "default",
}: {
  title: string;
  value: string;
  hint?: string;
  icon?: ComponentType<{ className?: string }>;
  trend?: "up" | "down" | "flat";
  trendLabel?: string;
  accent?: "default" | "green" | "rose" | "amber" | "blue";
}) {
  const accentColors = {
    default: "bg-[#FAF5EE] text-[#8B6914]",
    green: "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-600" : trend === "down" ? "text-rose-600" : "text-gray-400";

  return (
    <div className="rounded-xl border border-[#E8DFD4]/90 bg-white p-5 shadow-[0_8px_30px_-16px_rgba(43,26,15,0.12)] hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-2 mb-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#6B5344]">
          {title}
        </p>
        {Icon && (
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${accentColors[accent]}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold tabular-nums tracking-tight text-[#1F1209] sm:text-[1.65rem]">
        {value}
      </p>
      <div className="mt-2 flex items-center gap-1.5">
        {trend && trendLabel && (
          <div className={`flex items-center gap-1 text-[11px] font-semibold ${trendColor}`}>
            <TrendIcon className="h-3 w-3" />
            <span>{trendLabel}</span>
          </div>
        )}
        {hint && !trendLabel && (
          <p className="text-xs leading-snug text-[#6B5344]/90">{hint}</p>
        )}
        {hint && trendLabel && (
          <span className="text-[11px] text-[#8B7355]">· {hint}</span>
        )}
      </div>
    </div>
  );
}
