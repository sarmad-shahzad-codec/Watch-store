import { HeroSettings, HeroSlide } from "@/types/hero";
import { createClient } from "./client";

const LOCAL_STORAGE_KEY = "gt_hero_settings_v2";

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: "/images/hero-lineup/main.webp",
    badge: "Featured Masterpiece",
    model: "Rolex Submariner Date",
    price: "Rs. 34,500",
    category: "Master Diver",
    link: "/shop-without-sidebar?q=submariner",
    description: "Cerachrom ceramic bezel, 3135 automatic movement, and oyster steel finish.",
  },
  {
    id: 2,
    image: "/images/hero-lineup/tissot.webp",
    badge: "Bestseller",
    model: "Tissot PRX Powermatic 80",
    price: "Rs. 24,500",
    category: "Swiss Automatic",
    link: "/shop-without-sidebar?q=tissot",
    description: "Integrated bracelet, sunburst dial, and 80-hour power reserve.",
  },
  {
    id: 3,
    image: "/images/hero-lineup/hublot.webp",
    badge: "High Horology",
    model: "Hublot Big Bang Skeleton",
    price: "Rs. 38,000",
    category: "Fusion Architecture",
    link: "/shop-without-sidebar?q=hublot",
    description: "Multi-component fusion case with openwork skeleton mechanics.",
  },
  {
    id: 4,
    image: "/images/hero-lineup/tagHeuer.webp",
    badge: "Racing Legend",
    model: "TAG Heuer Carrera Chrono",
    price: "Rs. 28,500",
    category: "Motorsport Heritage",
    link: "/shop-without-sidebar?q=tag",
    description: "Tricompax chronograph dials with high-precision Swiss caliber.",
  },
];

export const DEFAULT_HERO_SETTINGS: HeroSettings = {
  id: 1,
  collection_tag: "New collection · 2026",
  headline: "Time, worn with glory.",
  description: "Classic, dress and everyday watches, picked for every wrist and every occasion.",
  primary_btn_text: "Shop the collection",
  primary_btn_link: "/shop-without-sidebar",
  secondary_btn_text: "New in",
  secondary_btn_link: "/shop-without-sidebar?sort=newest",
  men_card: {
    title: "Men's watches",
    image: "/images/2s/rolex-submariner-1.jpg",
    link: "/category/men",
  },
  women_card: {
    title: "Women's watches",
    image: "/images/2s/cartier-tank-1.jpg",
    link: "/category/women",
  },
  slides: DEFAULT_HERO_SLIDES,
};

function getLocalHeroSettings(): HeroSettings {
  if (typeof window === "undefined") return DEFAULT_HERO_SETTINGS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return DEFAULT_HERO_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_HERO_SETTINGS,
      ...parsed,
      men_card: { ...DEFAULT_HERO_SETTINGS.men_card, ...(parsed.men_card || {}) },
      women_card: { ...DEFAULT_HERO_SETTINGS.women_card, ...(parsed.women_card || {}) },
      slides: Array.isArray(parsed.slides) && parsed.slides.length > 0 ? parsed.slides : DEFAULT_HERO_SETTINGS.slides,
    };
  } catch {
    return DEFAULT_HERO_SETTINGS;
  }
}

function saveLocalHeroSettings(settings: HeroSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save local hero settings:", e);
  }
}

/**
 * Fetch Hero settings from API, Supabase, or localStorage
 */
export async function fetchHeroSettings(): Promise<HeroSettings> {
  try {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/admin/hero", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.settings) {
            saveLocalHeroSettings(json.settings);
            return json.settings;
          }
        }
      } catch (apiErr) {
        console.warn("API /api/admin/hero error, trying Supabase direct:", apiErr);
      }
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("hero_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) {
      return getLocalHeroSettings();
    }

    const settings: HeroSettings = {
      id: data.id,
      collection_tag: data.collection_tag || DEFAULT_HERO_SETTINGS.collection_tag,
      headline: data.headline || DEFAULT_HERO_SETTINGS.headline,
      description: data.description || DEFAULT_HERO_SETTINGS.description,
      primary_btn_text: data.primary_btn_text || DEFAULT_HERO_SETTINGS.primary_btn_text,
      primary_btn_link: data.primary_btn_link || DEFAULT_HERO_SETTINGS.primary_btn_link,
      secondary_btn_text: data.secondary_btn_text || DEFAULT_HERO_SETTINGS.secondary_btn_text,
      secondary_btn_link: data.secondary_btn_link || DEFAULT_HERO_SETTINGS.secondary_btn_link,
      men_card: data.men_card || DEFAULT_HERO_SETTINGS.men_card,
      women_card: data.women_card || DEFAULT_HERO_SETTINGS.women_card,
      slides: Array.isArray(data.slides) && data.slides.length > 0 ? data.slides : DEFAULT_HERO_SETTINGS.slides,
      updated_at: data.updated_at,
    };

    saveLocalHeroSettings(settings);
    return settings;
  } catch (err) {
    console.error("Error in fetchHeroSettings:", err);
    return getLocalHeroSettings();
  }
}

/**
 * Save Hero settings to API and Supabase
 */
export async function saveHeroSettings(
  settings: HeroSettings
): Promise<{ success: boolean; settings?: HeroSettings; error?: string }> {
  try {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/admin/hero", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        });
        const json = await res.json();
        if (res.ok && json.success && json.settings) {
          saveLocalHeroSettings(json.settings);
          return { success: true, settings: json.settings };
        } else if (!res.ok) {
          return { success: false, error: json.error || "Failed to save hero settings" };
        }
      } catch (apiErr) {
        console.warn("API save hero settings failed, falling back to direct client:", apiErr);
      }
    }

    const supabase = createClient();
    const payload = {
      id: 1,
      collection_tag: settings.collection_tag,
      headline: settings.headline,
      description: settings.description,
      primary_btn_text: settings.primary_btn_text,
      primary_btn_link: settings.primary_btn_link,
      secondary_btn_text: settings.secondary_btn_text,
      secondary_btn_link: settings.secondary_btn_link,
      men_card: settings.men_card,
      women_card: settings.women_card,
      slides: settings.slides,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("hero_settings")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    saveLocalHeroSettings(data);
    return { success: true, settings: data };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update hero settings" };
  }
}
