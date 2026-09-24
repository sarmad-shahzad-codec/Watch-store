import { Product } from "@/types/product";
import { createClient } from "./client";

export type DbProductRow = {
  id: number;
  brand: string;
  title: string;
  price: number | string;
  discounted_price: number | string;
  cost_price?: number | string | null;
  category?: string | null;
  packing_cost?: number | string | null;
  delivery_cost?: number | string | null;
  description: string | null;
  care_notes: string | null;
  reviews: number | null;
  specs: any;
  imgs: any;
  is_active: boolean | null;
  created_at?: string;
  updated_at?: string;
};

export function mapRowToProduct(row: DbProductRow): Product {
  let specs = [];
  if (Array.isArray(row.specs)) {
    specs = row.specs;
  } else if (typeof row.specs === "string") {
    try {
      specs = JSON.parse(row.specs);
    } catch {
      specs = [];
    }
  }

  let variants: any = undefined;
  if (row.imgs && typeof row.imgs === "object" && Array.isArray(row.imgs.variants) && row.imgs.variants.length > 0) {
    variants = row.imgs.variants;
  } else if ((row as any).variants && Array.isArray((row as any).variants) && (row as any).variants.length > 0) {
    variants = (row as any).variants;
  }

  let imgs: any = {
    thumbnails: ["/images/rolex.webp"],
    previews: ["/images/rolex.webp"],
  };
  if (row.imgs && typeof row.imgs === "object") {
    imgs = {
      thumbnails: Array.isArray(row.imgs.thumbnails) && row.imgs.thumbnails.length > 0
        ? row.imgs.thumbnails
        : ["/images/rolex.webp"],
      previews: Array.isArray(row.imgs.previews) && row.imgs.previews.length > 0
        ? row.imgs.previews
        : ["/images/rolex.webp"],
      ...(variants ? { variants } : {}),
    };
  }

  return {
    id: Number(row.id),
    brand: row.brand || "Gloria Times",
    title: row.title || "Luxury Watch",
    category: row.category || "Luxury Watches",
    price: Number(row.price) || 0,
    discountedPrice: Number(row.discounted_price) || 0,
    costPrice: Number(row.cost_price) || 0,
    packingCost: Number(row.packing_cost) || 0,
    deliveryCost: Number(row.delivery_cost) || 0,
    description: row.description || "",
    careNotes: row.care_notes || "",
    reviews: Number(row.reviews) || 0,
    specs,
    imgs,
    ...(variants ? { variants } : {}),
  };
}

/**
 * Fetch all active products from Supabase database.
 */
export async function fetchProductsFromSupabase(): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Supabase fetchProducts error:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(mapRowToProduct);
  } catch (err) {
    console.error("Error connecting to Supabase products:", err);
    return [];
  }
}

/**
 * Update list, sale, and purchase cost prices for a product in Supabase.
 */
export async function updateProductFinancesInSupabase(
  id: number,
  costPrice: number,
  discountedPrice: number,
  price: number,
  packingCost?: number,
  deliveryCost?: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const payload: any = {
      cost_price: Math.round(costPrice),
      discounted_price: Math.round(discountedPrice),
      price: Math.round(price),
      updated_at: new Date().toISOString(),
    };
    if (packingCost !== undefined) payload.packing_cost = Math.round(packingCost);
    if (deliveryCost !== undefined) payload.delivery_cost = Math.round(deliveryCost);

    const { error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update finances" };
  }
}

/**
 * Update list and sale prices for a product in Supabase.
 */
export async function updateProductPriceInSupabase(
  id: number,
  price: number,
  discountedPrice: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update({
        price: Math.round(price),
        discounted_price: Math.round(discountedPrice),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update price" };
  }
}

/**
 * Create a new product in Supabase (Shopify style).
 */
export async function createProductInSupabase(
  newProduct: Omit<Product, "id"> & { id?: number }
): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const supabase = createClient();
    const payload: any = {
      brand: newProduct.brand,
      title: newProduct.title,
      category: newProduct.category || "Luxury Watches",
      price: Math.round(newProduct.price),
      discounted_price: Math.round(newProduct.discountedPrice),
      cost_price: Math.round(newProduct.costPrice || 0),
      packing_cost: Math.round(newProduct.packingCost || 0),
      delivery_cost: Math.round(newProduct.deliveryCost || 0),
      description: newProduct.description || "",
      care_notes: newProduct.careNotes || "",
      reviews: newProduct.reviews || 0,
      specs: newProduct.specs || [],
      imgs: {
        thumbnails: newProduct.imgs?.thumbnails || ["/images/rolex.webp"],
        previews: newProduct.imgs?.previews || ["/images/rolex.webp"],
        ...(newProduct.variants && newProduct.variants.length > 0
          ? { variants: newProduct.variants }
          : newProduct.imgs?.variants
          ? { variants: newProduct.imgs.variants }
          : {}),
      },
      is_active: true,
      updated_at: new Date().toISOString(),
    };

    if (newProduct.id) {
      payload.id = newProduct.id;
    }

    const { data, error } = await supabase
      .from("products")
      .insert([payload])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, product: mapRowToProduct(data) };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to create product" };
  }
}

/**
 * Update full product info in Supabase.
 */
export async function updateProductInSupabase(
  id: number,
  updates: Partial<Product>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const payload: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.brand !== undefined) payload.brand = updates.brand;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.price !== undefined) payload.price = Math.round(updates.price);
    if (updates.discountedPrice !== undefined)
      payload.discounted_price = Math.round(updates.discountedPrice);
    if (updates.costPrice !== undefined) payload.cost_price = Math.round(updates.costPrice);
    if (updates.packingCost !== undefined) payload.packing_cost = Math.round(updates.packingCost);
    if (updates.deliveryCost !== undefined) payload.delivery_cost = Math.round(updates.deliveryCost);
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.careNotes !== undefined) payload.care_notes = updates.careNotes;
    if (updates.specs !== undefined) payload.specs = updates.specs;
    if (updates.imgs !== undefined || updates.variants !== undefined) {
      const baseImgs: Record<string, any> =
        updates.imgs && typeof updates.imgs === "object"
          ? (updates.imgs as Record<string, any>)
          : {};
      payload.imgs = {
        thumbnails: baseImgs.thumbnails || ["/images/rolex.webp"],
        previews: baseImgs.previews || ["/images/rolex.webp"],
        ...(updates.variants && updates.variants.length > 0
          ? { variants: updates.variants }
          : baseImgs.variants
          ? { variants: baseImgs.variants }
          : {}),
      };
    }

    const { error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update product" };
  }
}

/**
 * Delete a product from Supabase.
 */
export async function deleteProductFromSupabase(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to delete product" };
  }
}
