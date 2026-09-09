import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function StaticPageShell({ title, children }: Props) {
  return (
    <main className="bg-[#FAF8F5] pb-16 pt-[calc(6.25rem+env(safe-area-inset-top))] sm:pb-20 sm:pt-[calc(6.75rem+env(safe-area-inset-top))] md:pt-[calc(7rem+env(safe-area-inset-top))]">
      <div className="mx-auto max-w-[720px] px-4 sm:px-8 xl:px-0">
        <nav
          className="mb-6 text-[12px] text-[#6B5344]"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="transition-colors hover:text-[#4A2F19]">
            Home
          </Link>
          <span className="mx-2 opacity-60" aria-hidden>
            /
          </span>
          <span className="text-[#2B1A0F]">{title}</span>
        </nav>
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-[#1F1209] sm:text-3xl">
          {title}
        </h1>
        <div className="space-y-5 text-[15px] leading-relaxed text-[#4A3728]">
          {children}
        </div>
      </div>
    </main>
  );
}
