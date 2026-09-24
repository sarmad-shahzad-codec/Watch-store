import { Testimonial } from "@/types/testimonial";
import { createClient } from "./client";

const LOCAL_STORAGE_KEY = "gt_store_testimonials_v1";

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    authorName: "Hassan Raza",
    authorRole: "Lahore · Verified Buyer",
    watchModel: "Tissot PRX 1853 Automatic",
    review:
      "Received my Tissot PRX in Lahore within 2 days! The sunburst blue dial is breathtaking in natural sunlight and sweeping seconds hand is smooth. 100% recommended.",
    authorImg: "/images/hero-lineup/tissot.webp",
    rating: 5,
  },
  {
    id: 2,
    authorName: "Sarwat Malik",
    authorRole: "Islamabad · Collector",
    watchModel: "Rolex Submariner Ceramic Date",
    review:
      "The ceramic bezel and solid Oystersteel weight exceeded my expectations. Delivered with secure tamper-proof packaging and verification warranty card.",
    authorImg: "/images/hero-lineup/rolex-submariner.jpg",
    rating: 5,
  },
  {
    id: 3,
    authorName: "Amina Khan",
    authorRole: "Karachi · Verified Buyer",
    watchModel: "Cartier Santos De Cartier",
    review:
      "My second purchase from Gloria Times. The square Roman dial and QuickSwitch bracelet adjustment mechanism are gorgeous on wrist. Exemplary service.",
    authorImg: "/images/hero-lineup/cartier.webp",
    rating: 5,
  },
  {
    id: 4,
    authorName: "Omar Siddiqui",
    authorRole: "Rawalpindi · Verified Buyer",
    watchModel: "Patek Philippe Nautilus Automatic",
    review:
      "The unboxing experience was pure luxury. Blue embossed dial with rounded octagonal bezel looks phenomenal. Gloria Times is the only trusted store for timepieces.",
    authorImg: "/images/hero-lineup/main.webp",
    rating: 5,
  },
  {
    id: 5,
    authorName: "Bilal Ahmed",
    authorRole: "Faisalabad · Verified Buyer",
    watchModel: "Rolex Datejust Two-Tone Jubilee",
    review:
      "Golden fluted bezel shines brilliantly and the 5-link jubilee bracelet fits perfectly. Cash on delivery with open parcel inspection made it completely risk-free.",
    authorImg: "/images/hero-lineup/rolex-jubilee.webp",
    rating: 5,
  },
];

function getLocalTestimonials(): Testimonial[] {
  if (typeof window === "undefined") return DEFAULT_TESTIMONIALS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_TESTIMONIALS;
  } catch {
    return DEFAULT_TESTIMONIALS;
  }
}

function saveLocalTestimonials(items: Testimonial[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save local testimonials:", e);
  }
}

/**
 * Fetch all testimonials from API / Supabase.
 */
export async function fetchTestimonialsFromSupabase(): Promise<Testimonial[]> {
  try {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/testimonials", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.testimonials)) {
            saveLocalTestimonials(json.testimonials);
            return json.testimonials;
          }
        }
      } catch (apiErr) {
        console.warn("API /api/testimonials failed, attempting direct Supabase:", apiErr);
      }
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("store_testimonials")
      .select("*")
      .order("display_order", { ascending: true })
      .order("id", { ascending: false });

    if (error) {
      console.warn("Supabase fetchTestimonials error:", error);
      return getLocalTestimonials();
    }

    if (data && data.length > 0) {
      const parsed: Testimonial[] = data.map((row: any) => ({
        id: Number(row.id),
        authorName: row.author_name || "Customer",
        authorRole: row.author_role || "Verified Buyer",
        watchModel: row.watch_model || "",
        review: row.review || "",
        authorImg: row.image_url || "/images/hero-lineup/tissot.webp",
        rating: Number(row.rating) || 5,
        displayOrder: Number(row.display_order) || 0,
        created_at: row.created_at,
      }));
      saveLocalTestimonials(parsed);
      return parsed;
    }

    return getLocalTestimonials();
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    return getLocalTestimonials();
  }
}

/**
 * Create a new testimonial.
 */
export async function createTestimonialInSupabase(
  item: Omit<Testimonial, "id" | "created_at">
): Promise<{ success: boolean; testimonial?: Testimonial; error?: string }> {
  try {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        const json = await res.json();
        if (res.ok && json.success && json.testimonial) {
          const current = getLocalTestimonials();
          saveLocalTestimonials([json.testimonial, ...current]);
          return { success: true, testimonial: json.testimonial };
        } else if (!res.ok) {
          return { success: false, error: json.error || "Failed to create testimonial" };
        }
      } catch (apiErr) {
        console.warn("API create testimonial error:", apiErr);
      }
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("store_testimonials")
      .insert([
        {
          author_name: item.authorName,
          author_role: item.authorRole || "Verified Buyer",
          watch_model: item.watchModel || null,
          review: item.review,
          image_url: item.authorImg,
          rating: item.rating || 5,
          display_order: item.displayOrder || 0,
        },
      ])
      .select()
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Failed to create testimonial" };
    }

    const created: Testimonial = {
      id: Number(data.id),
      authorName: data.author_name,
      authorRole: data.author_role,
      watchModel: data.watch_model,
      review: data.review,
      authorImg: data.image_url,
      rating: Number(data.rating),
      displayOrder: Number(data.display_order),
      created_at: data.created_at,
    };

    const current = getLocalTestimonials();
    saveLocalTestimonials([created, ...current]);

    return { success: true, testimonial: created };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to create testimonial" };
  }
}

/**
 * Update an existing testimonial.
 */
export async function updateTestimonialInSupabase(
  id: number | string,
  updates: Partial<Omit<Testimonial, "id">>
): Promise<{ success: boolean; testimonial?: Testimonial; error?: string }> {
  try {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/testimonials", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...updates }),
        });
        const json = await res.json();
        if (res.ok && json.success) {
          const current = getLocalTestimonials();
          const updated = current.map((t) => (t.id === id ? { ...t, ...updates } : t));
          saveLocalTestimonials(updated);
          return { success: true, testimonial: json.testimonial };
        } else if (!res.ok) {
          return { success: false, error: json.error || "Failed to update testimonial" };
        }
      } catch (apiErr) {
        console.warn("API update testimonial error:", apiErr);
      }
    }

    const supabase = createClient();
    const payload: Record<string, any> = { updated_at: new Date().toISOString() };
    if (updates.authorName !== undefined) payload.author_name = updates.authorName;
    if (updates.authorRole !== undefined) payload.author_role = updates.authorRole;
    if (updates.watchModel !== undefined) payload.watch_model = updates.watchModel;
    if (updates.review !== undefined) payload.review = updates.review;
    if (updates.authorImg !== undefined) payload.image_url = updates.authorImg;
    if (updates.rating !== undefined) payload.rating = updates.rating;
    if (updates.displayOrder !== undefined) payload.display_order = updates.displayOrder;

    const { data, error } = await supabase
      .from("store_testimonials")
      .update(payload)
      .eq("id", Number(id))
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    const current = getLocalTestimonials();
    const updated = current.map((t) => (t.id === id ? { ...t, ...updates } : t));
    saveLocalTestimonials(updated);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update testimonial" };
  }
}

/**
 * Permanently delete a testimonial.
 */
export async function deleteTestimonialInSupabase(
  id: number | string
): Promise<{ success: boolean; error?: string }> {
  try {
    let apiSuccess = false;
    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/testimonials?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
        const json = await res.json();
        if (res.ok && json.success) {
          apiSuccess = true;
        } else if (!res.ok) {
          console.warn("API delete returned error:", json.error);
        }
      } catch (apiErr) {
        console.warn("API delete testimonial failed:", apiErr);
      }
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("store_testimonials")
      .delete()
      .eq("id", Number(id));

    if (error && !apiSuccess) {
      return { success: false, error: error.message };
    }

    const current = getLocalTestimonials();
    saveLocalTestimonials(current.filter((t) => t.id !== id));

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to delete testimonial" };
  }
}
