import { InstagramSettings } from "@/types/instagram";
import { createClient } from "./client";

const LOCAL_STORAGE_KEY = "gt_instagram_settings_v1";

const DEFAULT_SETTINGS: InstagramSettings = {
  profile_url: "https://www.instagram.com/gloriatimes.pk",
  handle: "@gloriatimes.pk",
  title: "Follow Us On Instagram",
  subtitle: "Tag @gloriatimes to be featured in our luxury timepiece gallery",
  enabled: true,
  posts: [
    {
      id: "1",
      post_url: "https://www.instagram.com/gloriatimes.pk",
      image_url: "/images/hero-lineup/tissot.webp",
      caption: "Tissot PRX Automatic Blue Dial on wrist",
      likes: "1.4k",
    },
    {
      id: "2",
      post_url: "https://www.instagram.com/gloriatimes.pk",
      image_url: "/images/hero-lineup/rolex-submariner.jpg",
      caption: "Rolex Submariner Ceramic Date - Pure luxury",
      likes: "2.8k",
    },
    {
      id: "3",
      post_url: "https://www.instagram.com/gloriatimes.pk",
      image_url: "/images/hero-lineup/cartier.webp",
      caption: "Cartier Santos De Cartier Automatic square Roman dial",
      likes: "1.9k",
    },
    {
      id: "4",
      post_url: "https://www.instagram.com/gloriatimes.pk",
      image_url: "/images/hero-lineup/main.webp",
      caption: "Patek Philippe Nautilus Automatic - Collector edition",
      likes: "3.5k",
    },
    {
      id: "5",
      post_url: "https://www.instagram.com/gloriatimes.pk",
      image_url: "/images/hero-lineup/rolex-jubilee.webp",
      caption: "Rolex Datejust Jubilee two-tone golden fluted bezel",
      likes: "2.1k",
    },
  ],
};

function getLocalSettings(): InstagramSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveLocalSettings(settings: InstagramSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save local instagram settings:", e);
  }
}

/**
 * Fetch Instagram feed settings from API, Supabase, or local storage.
 */
export async function fetchInstagramSettings(): Promise<InstagramSettings> {
  try {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/instagram", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.settings) {
            saveLocalSettings(json.settings);
            return json.settings;
          }
        }
      } catch (apiErr) {
        console.warn("API /api/instagram failed, attempting direct client:", apiErr);
      }
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("instagram_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) {
      return getLocalSettings();
    }

    const settings: InstagramSettings = {
      id: data.id,
      profile_url: data.profile_url || DEFAULT_SETTINGS.profile_url,
      handle: data.handle || DEFAULT_SETTINGS.handle,
      title: data.title || DEFAULT_SETTINGS.title,
      subtitle: data.subtitle || DEFAULT_SETTINGS.subtitle,
      enabled: data.enabled ?? true,
      posts: Array.isArray(data.posts) && data.posts.length > 0 ? data.posts : DEFAULT_SETTINGS.posts,
      updated_at: data.updated_at,
    };

    saveLocalSettings(settings);
    return settings;
  } catch (err) {
    console.error("Error fetching instagram settings:", err);
    return getLocalSettings();
  }
}

/**
 * Save updated Instagram feed settings to API & Supabase.
 */
export async function saveInstagramSettings(
  settings: InstagramSettings
): Promise<{ success: boolean; settings?: InstagramSettings; error?: string }> {
  try {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/instagram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        });
        const json = await res.json();
        if (res.ok && json.success && json.settings) {
          saveLocalSettings(json.settings);
          return { success: true, settings: json.settings };
        } else if (!res.ok) {
          return { success: false, error: json.error || "Failed to save settings" };
        }
      } catch (apiErr) {
        console.warn("API save instagram settings failed, falling back to direct client:", apiErr);
      }
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("instagram_settings")
      .upsert({ ...settings, id: 1 }, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    saveLocalSettings(data);
    return { success: true, settings: data };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update instagram settings" };
  }
}
