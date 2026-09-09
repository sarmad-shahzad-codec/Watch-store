"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { HERO_WATCH_IMAGES } from "@/constants/heroWatchImages";

const WATCHES: { src: string; label: string; depth: number }[] = [
  { src: HERO_WATCH_IMAGES.main, label: "Gloria Times", depth: 12 },
  { src: HERO_WATCH_IMAGES.tissot, label: "Tissot PRX", depth: 20 },
  { src: HERO_WATCH_IMAGES.hublot, label: "Hublot Big Bang", depth: 16 },
  { src: HERO_WATCH_IMAGES.tagHeuer, label: "TAG Heuer Carrera", depth: 18 },
];

const ENTER_MS = 900;
const VISIBLE_MS = 5000;
const EXIT_MS = 800;
const SESSION_KEY = "gt_parallax_intro";

export default function WatchParallaxIntro() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [panel, setPanel] = useState<"off" | "in" | "out">("off");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname !== "/") {
      setActive(false);
      setPanel("off");
      return;
    }
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") {
        return;
      }
    } catch {
      /* ignore */
    }

    setActive(true);
    const start = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPanel("in"));
    });

    const exitTimer = window.setTimeout(
      () => setPanel("out"),
      ENTER_MS + VISIBLE_MS
    );
    const doneTimer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      setActive(false);
      setPanel("off");
    }, ENTER_MS + VISIBLE_MS + EXIT_MS);

    return () => {
      cancelAnimationFrame(start);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [pathname]);

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  const onPointerMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!rootRef.current || panel !== "in") return;
      const r = rootRef.current.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      setMouse({ x: nx * 2, y: ny * 2 });
    },
    [panel]
  );

  if (!active) return null;

  const translateX =
    panel === "off" ? "-100%" : panel === "out" ? "100%" : "0%";

  return (
    <div
      className="fixed inset-0 z-[1000000] flex flex-col justify-center overflow-hidden"
      ref={rootRef}
      onMouseMove={onPointerMove}
      role="dialog"
      aria-modal="true"
      aria-label="Gloria Times collection preview"
    >
      <div
        className="absolute inset-0 bg-[#0d0805]"
        style={{
          backgroundImage: `url('${HERO_WATCH_IMAGES.woodenBg}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-[#1a0f08]/80"
        aria-hidden
      />

      <div
        className="relative z-10 flex h-full w-full flex-col will-change-transform transition-transform ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: `translate3d(${translateX},0,0)`,
          transitionDuration: `${panel === "out" ? EXIT_MS : ENTER_MS}ms`,
        }}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-8 sm:px-8 sm:py-10">
          <p className="text-center text-[10px] tracking-[0.35em] text-[#F2C27B] sm:text-xs">
            GLORIA TIMES
          </p>
          <h2 className="mt-2 text-center text-lg font-semibold tracking-[0.2em] text-[#F7D08A] sm:text-2xl md:text-3xl">
            Our watches in one view
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-xs leading-relaxed text-[#FDF4E3]/85 sm:text-sm">
            Curated timepieces from the hero collection—move your cursor for a
            subtle parallax depth.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:gap-5">
            {WATCHES.map((item) => (
              <div
                key={item.src}
                className="relative flex aspect-square flex-col items-center justify-end rounded-lg bg-black/20 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-[2px]"
                style={{
                  transform:
                    panel === "in"
                      ? `translate3d(${mouse.x * item.depth}px, ${mouse.y * item.depth}px, 0)`
                      : undefined,
                  transition:
                    panel === "in"
                      ? "transform 0.35s ease-out"
                      : "transform 0.6s ease-out",
                }}
              >
                <div className="relative h-[72%] w-full sm:h-[76%]">
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className="object-contain object-bottom drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)]"
                    sizes="(max-width: 768px) 45vw, 22vw"
                    priority
                  />
                </div>
                <p className="mt-2 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-[#FDF4E3]/90 sm:text-[11px]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-[10px] tracking-[0.25em] text-white/50 sm:bottom-8">
          Continuing in a moment…
        </div>
      </div>
    </div>
  );
}
