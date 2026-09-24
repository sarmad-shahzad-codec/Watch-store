export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductColorVariant = {
  name: string;
  image: string;
  colorHex?: string;
};

export type Product = {
  title: string;
  subtitle?: string;
  reviews: number;
  /** Pakistani Rupees (PKR), whole rupees */
  price: number;
  /** Pakistani Rupees (PKR), whole rupees */
  discountedPrice: number;
  /** Unit purchase / manufacturing cost in PKR */
  costPrice?: number;
  id: number;
  /** Maison / house line — used for shop filters */
  brand: string;
  /** Full marketing copy for the details tab */
  description: string;
  /** Care & maintenance guidance */
  careNotes: string;
  /** Rows for “Additional information” */
  specs: ProductSpec[];
  imgs?: {
    thumbnails: string[];
    previews: string[];
    variants?: ProductColorVariant[];
  };
  /** Color/dial/strap variants for Shopify-style swatch switcher */
  variants?: ProductColorVariant[];
  /** Primary product category (e.g. Men's Automatic, Luxury, Chronograph) */
  category?: string;
  /** Unit watch box, cushion, warranty card packing cost in PKR */
  packingCost?: number;
  /** Courier delivery fee / allowance in PKR */
  deliveryCost?: number;
};

