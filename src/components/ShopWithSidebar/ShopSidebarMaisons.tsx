/** Editorial sidebar panel — complements shop-by-brand filters */
export default function ShopSidebarMaisons() {
  return (
    <div className="rounded-lg border border-[#EDE4D8] bg-gradient-to-b from-white to-[#FAF8F5]/95 px-5 py-4 shadow-1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4A2F19]">
        Featured maisons
      </p>
      <p className="mt-2 text-[11px] leading-relaxed text-dark-4">
        Gloria Times brings together accessible Swiss sport watches and globally
        recognised icons — so you can compare lines like{" "}
        <span className="font-medium text-dark">Tissot</span> and{" "}
        <span className="font-medium text-dark">TAG Heuer</span> alongside bold
        fusion pieces from{" "}
        <span className="font-medium text-dark">Hublot</span>, tool-watch
        legends from <span className="font-medium text-dark">Rolex</span>, and
        rare complications from{" "}
        <span className="font-medium text-dark">Patek Philippe</span>.
      </p>
      <ul className="mt-3 space-y-2 border-t border-[#EDE4D8]/80 pt-3 text-[11px] leading-snug text-dark-4">
        <li>
          <span className="font-medium text-dark">Tissot</span> — Swiss
          heritage with everyday pricing.
        </li>
        <li>
          <span className="font-medium text-dark">Rolex</span> — Oyster cases,
          chronometers, and enduring resale strength.
        </li>
        <li>
          <span className="font-medium text-dark">Hublot</span> — bold cases,
          fusion materials, statement wrists.
        </li>
        <li>
          <span className="font-medium text-dark">TAG Heuer</span> — Carrera &
          motorsport timing DNA.
        </li>
      </ul>
    </div>
  );
}
