import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { Testimonial } from "@/types/testimonial";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mapRowToTestimonial(row: any): Testimonial {
  return {
    id: Number(row.id),
    review: row.review || "",
    authorName: row.author_name || "Customer",
    authorRole: row.author_role || "Verified Buyer",
    authorImg: row.image_url || "/images/hero-lineup/tissot.webp",
    watchModel: row.watch_model || "",
    rating: Number(row.rating) || 5,
    displayOrder: Number(row.display_order) || 0,
    created_at: row.created_at,
  };
}

/**
 * GET /api/testimonials
 * Fetches all testimonials from Supabase.
 */
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("store_testimonials")
      .select("*")
      .order("display_order", { ascending: true })
      .order("id", { ascending: false });

    if (error) {
      console.error("[API Testimonials] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const testimonials = (data || []).map(mapRowToTestimonial);
    return NextResponse.json({ success: true, testimonials });
  } catch (err: any) {
    console.error("[API Testimonials] GET error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/testimonials
 * Creates a new testimonial in Supabase.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { authorName, authorRole, watchModel, review, authorImg, rating, displayOrder } = body;

    if (!authorName || !review || !authorImg) {
      return NextResponse.json(
        { error: "Author name, review text, and picture URL are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const payload = {
      author_name: String(authorName).trim(),
      author_role: String(authorRole || "Verified Buyer").trim(),
      watch_model: watchModel ? String(watchModel).trim() : null,
      review: String(review).trim(),
      image_url: String(authorImg).trim(),
      rating: Number(rating) || 5,
      display_order: Number(displayOrder) || 0,
    };

    const { data, error } = await supabase
      .from("store_testimonials")
      .insert([payload])
      .select()
      .single();

    if (error || !data) {
      console.error("[API Testimonials] Insert error:", error);
      return NextResponse.json(
        { error: error?.message || "Failed to create testimonial" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, testimonial: mapRowToTestimonial(data) });
  } catch (err: any) {
    console.error("[API Testimonials] POST error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/testimonials
 * Updates an existing testimonial.
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, authorName, authorRole, watchModel, review, authorImg, rating, displayOrder } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (authorName !== undefined) updates.author_name = String(authorName).trim();
    if (authorRole !== undefined) updates.author_role = String(authorRole).trim();
    if (watchModel !== undefined) updates.watch_model = watchModel ? String(watchModel).trim() : null;
    if (review !== undefined) updates.review = String(review).trim();
    if (authorImg !== undefined) updates.image_url = String(authorImg).trim();
    if (rating !== undefined) updates.rating = Number(rating);
    if (displayOrder !== undefined) updates.display_order = Number(displayOrder);

    const { data, error } = await supabase
      .from("store_testimonials")
      .update(updates)
      .eq("id", Number(id))
      .select()
      .single();

    if (error) {
      console.error("[API Testimonials] Update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, testimonial: mapRowToTestimonial(data) });
  } catch (err: any) {
    console.error("[API Testimonials] PUT error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/testimonials
 * Permanently deletes a testimonial from Supabase.
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {
        // empty body
      }
    }

    if (!id) {
      return NextResponse.json({ error: "id parameter is required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error, count } = await supabase
      .from("store_testimonials")
      .delete({ count: "exact" })
      .eq("id", Number(id));

    if (error) {
      console.error("[API Testimonials] Delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: Number(id), count });
  } catch (err: any) {
    console.error("[API Testimonials] DELETE error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
