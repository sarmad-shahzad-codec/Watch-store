"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Activity, ShieldCheck } from "lucide-react";
import {
  SOCIAL_PROOF_EVENTS,
  actionVerb,
  getSocialProofProduct,
} from "@/data/socialProof";

/** How long each card stays fully visible before exiting */
const SHOW_DURATION_MS = 2000;
/** Exit animation, then content swap */
const EXIT_MS = 480;
const INITIAL_DELAY_MS = 1400;

export default function SocialProofToast() {
  const pathname = usePathname();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"hidden" | "show" | "hide">("hidden");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const onChange = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const advance = useCallback(() => {
    setPhase("hide");
    window.setTimeout(() => {
      setIndex((i) => (i + 1) % SOCIAL_PROOF_EVENTS.length);
      setPhase("show");
    }, EXIT_MS);
  }, []);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    const t = window.setTimeout(
      () => setPhase("show"),
      prefersReducedMotion ? 300 : INITIAL_DELAY_MS
    );
    return () => window.clearTimeout(t);
  }, [pathname, prefersReducedMotion]);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    if (phase !== "show") return;
    const id = window.setTimeout(advance, SHOW_DURATION_MS);
    return () => window.clearTimeout(id);
  }, [phase, pathname, advance]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const entry = SOCIAL_PROOF_EVENTS[index];
  const product = getSocialProofProduct(entry.productIndex);
  const verb = actionVerb(entry.action);
  const titleUpper = product.title.toUpperCase();

  const motionClass = prefersReducedMotion
    ? phase === "show"
      ? "opacity-100"
      : "opacity-0"
    : phase === "show"
      ? "translate-x-0 translate-y-0 scale-100 rotate-0 opacity-100"
      : phase === "hide"
        ? "-translate-x-[108%] translate-y-1 scale-[0.96] opacity-0"
        : "-translate-x-[108%] translate-y-2 scale-[0.94] opacity-0";

  const transitionClass = prefersReducedMotion
    ? "transition-opacity duration-300 ease-out"
    : "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

  return (
    <div
      className="pointer-events-none fixed bottom-5 left-4 z-[9980] w-[min(100vw-2rem,268px)] sm:bottom-7 sm:left-7 sm:w-[min(100vw-2rem,284px)]"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={`pointer-events-auto relative overflow-hidden rounded-[22px] border border-white/90 bg-white/85 shadow-[0_12px_48px_-8px_rgba(43,26,15,0.28),0_4px_16px_-4px_rgba(74,47,25,0.12),inset_0_1px_0_0_rgba(255,255,255,0.9)] ring-1 ring-[#F2C27B]/35 backdrop-blur-xl ${transitionClass} ${motionClass}`}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FFFCF7] via-white/40 to-[#FAF8F5]/90"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#F2C27B]/12 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A227]/45 to-transparent"
          aria-hidden
        />

        {phase === "show" && !prefersReducedMotion && (
          <div
            key={`bar-${index}`}
            className="animate-social-proof-progress absolute bottom-0 left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-[#8B6914] via-[#F2C27B] to-[#C9A227]"
            style={{ animationDuration: `${SHOW_DURATION_MS}ms` }}
            aria-hidden
          />
        )}

        <div className="relative flex items-start gap-2 px-2.5 py-2 pr-3">
          <div className="relative shrink-0">
            <span className="absolute -right-0.5 -top-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-gradient-to-br from-[#1a1009] to-[#4A2F19] shadow-md ring-2 ring-white">
              <Activity
                className="h-2.5 w-2.5 text-[#F2C27B]"
                strokeWidth={2.5}
                aria-hidden
              />
            </span>
            <Link
              href={`/shop-details/${product.id}`}
              className="relative block h-12 w-12 overflow-hidden rounded-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.85)] ring-2 ring-[#EDE4D8]/90"
              tabIndex={-1}
              aria-label={`View ${product.title}`}
            >
              <Image
                src={product.imageSrc}
                alt=""
                fill
                sizes="48px"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </Link>
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center justify-between gap-1.5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8B7355]">
                Live activity
              </p>
              {!prefersReducedMotion ? (
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/90 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
                </span>
              ) : (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              )}
            </div>

            <p className="text-[11px] leading-[1.35] text-[#2B1A0F]">
              <span className="font-semibold text-[#1F1209]">
                {entry.customerName}
              </span>
              <span className="text-[#6B5344]"> ({entry.city}) </span>
              <span className="font-semibold text-[#4A2F19]">{verb}</span>
            </p>

            <p className="line-clamp-2 text-[9px] font-bold uppercase leading-snug tracking-[0.04em] text-[#1F1209]">
              {titleUpper}
            </p>

            <p className="flex flex-nowrap items-center gap-1.5 pt-0.5 text-[9px] text-[#6B5344]">
              <span className="shrink-0 tabular-nums">{entry.timeLabel}</span>
              <span
                className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-px text-[9px] font-semibold text-emerald-800 ring-1 ring-emerald-200/80"
              >
                <ShieldCheck
                  className="h-2.5 w-2.5 shrink-0 text-emerald-600"
                  strokeWidth={2.5}
                  aria-hidden
                />
                Verified
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
