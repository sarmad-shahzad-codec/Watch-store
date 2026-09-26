"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  ExternalLink,
  Landmark,
  Instagram,
  MessageSquareQuote,
  Sparkles,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  end?: boolean;
};

const NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/hero", label: "Hero Banner", icon: Sparkles },
  { href: "/admin/finances", label: "Finances", icon: Landmark },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/instagram", label: "Instagram Feed", icon: Instagram },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, end?: boolean) => {
    if (end) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F5] text-[#1F1209]">
      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[260px] flex-col border-r border-[#2B1A0F]/15 bg-[#141008] text-[#FDF4E3] shadow-xl transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-4">
          <Link
            href="/admin"
            className="flex items-center gap-2.5"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/images/logo.png"
              alt=""
              width={36}
              height={36}
              className="rounded-sm opacity-95"
            />
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#F2C27B]/90">
                Gloria Times
              </p>
              <p className="text-sm font-semibold tracking-wide">Admin</p>
            </div>
          </Link>
          <button
            type="button"
            className="rounded-md p-2 text-[#FDF4E3]/80 hover:bg-white/10 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-4">
          {NAV.map(({ href, label, icon: Icon, end }) => {
            const active = isActive(href, end);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#F2C27B]/15 text-[#F7D08A] ring-1 ring-[#F2C27B]/30"
                    : "text-[#FDF4E3]/85 hover:bg-white/8"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-90" strokeWidth={1.75} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-xs font-medium tracking-wide text-[#FDF4E3]/90 transition hover:bg-white/10"
          >
            View storefront
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:ml-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[#E8DFD4] bg-[#FAF8F5]/95 px-4 py-3 backdrop-blur-sm sm:px-6">
          <button
            type="button"
            className="rounded-md border border-[#DDD5CC] bg-white p-2 text-[#2B1A0F] lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs uppercase tracking-[0.2em] text-[#6B5344]">
              Store control
            </p>
            <h1 className="truncate text-lg font-semibold text-[#1F1209] sm:text-xl">
              Gloria Times — Operations
            </h1>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-[11px] text-[#6B5344]">Currency</p>
            <p className="text-sm font-medium tabular-nums text-[#2B1A0F]">PKR</p>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
