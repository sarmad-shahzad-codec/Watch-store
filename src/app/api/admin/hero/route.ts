import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { HeroSettings } from "@/types/hero";
import { DEFAULT_HERO_SETTINGS } from "@/utils/supabase/hero";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/hero
 * Returns the current Hero section settings and slides.
 */
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("hero_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.warn("[API Hero] Supabase error, returning default settings:", error);
      return NextResponse.json({ success: true, settings: DEFAULT_HERO_SETTINGS });
    }

    if (!data) {
      return NextResponse.json({ success: true, settings: DEFAULT_HERO_SETTINGS });
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

    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    console.error("[API Hero] GET error:", err);
    return NextResponse.json({ success: true, settings: DEFAULT_HERO_SETTINGS });
  }
}

/**
 * POST /api/admin/hero
 * Saves updated Hero section settings and slides.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      collection_tag,
      headline,
      description,
      primary_btn_text,
      primary_btn_link,
      secondary_btn_text,
      secondary_btn_link,
      men_card,
      women_card,
      slides,
    } = body;

    const supabase = createAdminClient();
    const payload = {
      id: 1,
      collection_tag: String(collection_tag || "").trim() || DEFAULT_HERO_SETTINGS.collection_tag,
      headline: String(headline || "").trim() || DEFAULT_HERO_SETTINGS.headline,
      description: String(description || "").trim() || DEFAULT_HERO_SETTINGS.description,
      primary_btn_text: String(primary_btn_text || "").trim() || DEFAULT_HERO_SETTINGS.primary_btn_text,
      primary_btn_link: String(primary_btn_link || "").trim() || DEFAULT_HERO_SETTINGS.primary_btn_link,
      secondary_btn_text: String(secondary_btn_text || "").trim() || DEFAULT_HERO_SETTINGS.secondary_btn_text,
      secondary_btn_link: String(secondary_btn_link || "").trim() || DEFAULT_HERO_SETTINGS.secondary_btn_link,
      men_card: men_card || DEFAULT_HERO_SETTINGS.men_card,
      women_card: women_card || DEFAULT_HERO_SETTINGS.women_card,
      slides: Array.isArray(slides) && slides.length > 0 ? slides : DEFAULT_HERO_SETTINGS.slides,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("hero_settings")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      console.error("[API Hero] Failed to save:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, settings: data });
  } catch (err: any) {
    console.error("[API Hero] POST error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
