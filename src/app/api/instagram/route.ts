import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { InstagramSettings } from "@/types/instagram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

/**
 * GET /api/instagram
 * Returns the current Instagram feed settings and recent posts.
 */
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("instagram_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.warn("[API Instagram] Supabase error, returning fallback:", error);
      return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
    }

    if (!data) {
      return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
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

    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    console.error("[API Instagram] GET error:", err);
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
  }
}

/**
 * POST /api/instagram
 * Updates Instagram settings and posts.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { profile_url, handle, title, subtitle, enabled, posts } = body;

    const supabase = createAdminClient();
    const payload = {
      id: 1,
      profile_url: String(profile_url || "").trim() || DEFAULT_SETTINGS.profile_url,
      handle: String(handle || "").trim() || DEFAULT_SETTINGS.handle,
      title: String(title || "").trim() || DEFAULT_SETTINGS.title,
      subtitle: String(subtitle || "").trim() || DEFAULT_SETTINGS.subtitle,
      enabled: typeof enabled === "boolean" ? enabled : true,
      posts: Array.isArray(posts) ? posts : DEFAULT_SETTINGS.posts,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("instagram_settings")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      console.error("[API Instagram] Failed to save:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, settings: data });
  } catch (err: any) {
    console.error("[API Instagram] POST error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
