import type { Product } from "@/types/product";

export type ShopSortKey =
  | "latest"
  | "bestseller"
  | "price_low"
  | "price_high"
  | "oldest";

/** PKR price bands (discounted price) matching Gloria Times catalog */
export type ShopPriceFilter =
  | "all"
  | "under_2500"
  | "between_2500_3500"
  | "between_3500_5000"
  | "over_5000";

export type ShopFilters = {
  search: string;
  brand: string;
  category?: string;
  price: ShopPriceFilter;
  sort: ShopSortKey;
};

/** Sidebar brand list — order favours iconic Swiss maisons first */
export type SidebarBrandRow = {
  value: string;
  name: string;
  products: number;
};

const SIDEBAR_BRAND_ORDER = [
  "Rolex",
  "Patek Philippe",
  "Hublot",
  "TAG Heuer",
  "Tissot",
  "Gloria Times",
] as const;

export function getSidebarBrandRows(products: Product[]): SidebarBrandRow[] {
  const counts = new Map<string, number>();
  for (const p of products) {
    counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
  }

  const brands = Array.from(counts.keys());
  const order = SIDEBAR_BRAND_ORDER as readonly string[];
  brands.sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    const unk = 999;
    const va = ia === -1 ? unk : ia;
    const vb = ib === -1 ? unk : ib;
    if (va !== vb) return va - vb;
    return a.localeCompare(b);
  });

  return [
    {
      value: "all",
      name: "All maisons",
      products: products.length,
    },
    ...brands.map((b) => ({
      value: b,
      name: b,
      products: counts.get(b)!,
    })),
  ];
}

export function filterAndSortProducts(
  products: Product[],
  f: ShopFilters
): Product[] {
  let list = products.filter((p) => {
    const q = f.search.trim().toLowerCase();
    if (q) {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchCat = p.category ? p.category.toLowerCase().includes(q) : false;
      if (!matchTitle && !matchBrand && !matchCat) return false;
    }

    if (f.brand !== "all" && p.brand !== f.brand) return false;

    if (f.category && f.category !== "all") {
      const targetCat = f.category.toLowerCase().trim();
      const pCat = (p.category || "").toLowerCase().trim();
      const pBrand = (p.brand || "").toLowerCase().trim();
      const matchCat = pCat === targetCat || pCat.includes(targetCat) || targetCat.includes(pCat);
      const matchBrand = pBrand === targetCat || pBrand.includes(targetCat) || targetCat.includes(pBrand);
      if (!matchCat && !matchBrand) {
        return false;
      }
    }

    const d = p.discountedPrice ?? p.price;
    switch (f.price) {
      case "under_2500":
        if (d >= 2500) return false;
        break;
      case "between_2500_3500":
        if (d < 2500 || d >= 3500) return false;
        break;
      case "between_3500_5000":
        if (d < 3500 || d >= 5000) return false;
        break;
      case "over_5000":
        if (d < 5000) return false;
        break;
      default:
        break;
    }
    return true;
  });

  list = [...list];

  switch (f.sort) {
    case "latest":
      list.sort((a, b) => b.id - a.id);
      break;
    case "oldest":
      list.sort((a, b) => a.id - b.id);
      break;
    case "bestseller":
      list.sort((a, b) => b.reviews - a.reviews);
      break;
    case "price_low":
      list.sort((a, b) => a.discountedPrice - b.discountedPrice);
      break;
    case "price_high":
      list.sort((a, b) => b.discountedPrice - a.discountedPrice);
      break;
    default:
      break;
  }

  return list;
}
