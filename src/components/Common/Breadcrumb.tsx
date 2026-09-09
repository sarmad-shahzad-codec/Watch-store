import Link from "next/link";
import React from "react";
import { ChevronRight } from "lucide-react";

export type BreadcrumbVariant = "default" | "luxury";

type BreadcrumbProps = {
  title: string;
  pages: string[];
  variant?: BreadcrumbVariant;
};

const Breadcrumb = ({ title, pages, variant = "default" }: BreadcrumbProps) => {
  if (variant === "luxury") {
    return (
      <div className="overflow-hidden bg-[#FAF8F5] border-b border-[#E8DFD4]/90 pt-[calc(7.25rem+env(safe-area-inset-top))] sm:pt-[8.5rem] lg:pt-[7.75rem] xl:pt-[12.5rem]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 py-6 sm:py-7 xl:py-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.42em] text-[#8B5A2B] mb-2">
                Collection
              </p>
              <h1 className="font-semibold text-[#1F1209] text-[1.75rem] sm:text-[2rem] xl:text-[2.25rem] tracking-[-0.02em] leading-tight">
                {title}
              </h1>
              <p className="mt-2 text-custom-sm text-dark-3 max-w-md leading-relaxed hidden sm:block">
                Handpicked watches with verified provenance and detail pages for
                every piece.
              </p>
            </div>

            <nav aria-label="Breadcrumb" className="shrink-0">
              <ol className="flex flex-wrap items-center gap-1 text-[13px]">
                <li>
                  <Link
                    href="/"
                    className="text-[#6B5344] hover:text-[#4A2F19] transition-colors"
                  >
                    Home
                  </Link>
                </li>
                {pages.map((page, key) => (
                  <React.Fragment key={key}>
                    <li className="text-[#C9A882] px-0.5" aria-hidden>
                      <ChevronRight className="w-4 h-4 inline opacity-70" strokeWidth={1.75} />
                    </li>
                    <li>
                      <span
                        className={
                          key === pages.length - 1
                            ? "font-medium text-[#4A2F19] capitalize"
                            : "text-[#6B5344] capitalize"
                        }
                      >
                        {page}
                      </span>
                    </li>
                  </React.Fragment>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow-breadcrumb pt-[209px] sm:pt-[155px] lg:pt-[95px] xl:pt-[165px]">
      <div className="border-t border-gray-3">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 py-5 xl:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="font-semibold text-dark text-xl sm:text-2xl xl:text-custom-2">
              {title}
            </h1>

            <ul className="flex flex-wrap items-center gap-2">
              <li className="text-custom-sm hover:text-blue">
                <Link href="/">Home /</Link>
              </li>

              {pages.length > 0 &&
                pages.map((page, key) => (
                  <li
                    className="text-custom-sm last:text-blue capitalize"
                    key={key}
                  >
                    {page}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
