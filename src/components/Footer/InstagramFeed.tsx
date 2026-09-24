"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Instagram, ExternalLink, Heart } from "lucide-react";
import { InstagramSettings } from "@/types/instagram";
import { fetchInstagramSettings } from "@/utils/supabase/instagram";

export default function InstagramFeed() {
  const [settings, setSettings] = useState<InstagramSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchInstagramSettings().then((data) => {
      if (mounted) {
        setSettings(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!loading && (!settings || settings.enabled === false || !settings.posts || settings.posts.length === 0)) {
    return null;
  }

  const posts = settings?.posts || [];
  const handle = settings?.handle || "@gloriatimes_";
  const profileUrl = settings?.profile_url || "https://www.instagram.com/gloriatimes_/?hl=en";

  return (
    <section className="w-full bg-[#FAF8F5] border-t border-[#EDE4D8] py-14 sm:py-16">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 text-[#8B6914] text-[11px] font-bold tracking-[0.2em] uppercase mb-3">
            <Instagram className="h-3 w-3 text-[#8B6914]" />
            <span>Gloria Times On Instagram</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1F1209]">
            {settings?.title || "Follow Us On Instagram"}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#6B5344] leading-relaxed">
            {settings?.subtitle || "Tag @gloriatimes_ to be featured in our timepiece connoisseurs collection."}
          </p>
          <div className="mt-3">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B6914] hover:text-[#5B4310] transition-colors underline-offset-4 hover:underline"
            >
              <span>{handle}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Instagram Posts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {loading ? (
            // Skeleton loaders
            Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-2xl bg-white/70 animate-pulse border border-[#EDE4D8]"
              />
            ))
          ) : (
            posts.slice(0, 5).map((post, idx) => {
              const postLink = post.post_url || profileUrl;
              return (
                <a
                  key={post.id || idx}
                  href={postLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-white border border-[#E8DFD4] shadow-sm hover:shadow-xl transition-all duration-300 block"
                >
                  {/* Post Image */}
                  <div className="relative w-full h-full p-2">
                    <Image
                      src={post.image_url || "/images/hero-lineup/tissot.webp"}
                      alt={post.caption || `Gloria Times Instagram Post ${idx + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-contain p-2 transform group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>

                  {/* Dark Luxury Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div className="h-7 w-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <Instagram className="h-4 w-4" />
                      </div>
                      {post.likes && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-white/90">
                          <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
                          <span>{post.likes}</span>
                        </span>
                      )}
                    </div>

                    <div>
                      {post.caption && (
                        <p className="text-[11px] text-white/90 font-medium line-clamp-2 leading-snug mb-2">
                          {post.caption}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#F2C27B]">
                        <span>View on Instagram</span>
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </a>
              );
            })
          )}
        </div>

        {/* Bottom Action Button */}
        <div className="text-center mt-10">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-[#1F1209] hover:bg-black text-[#FDF4E3] text-xs font-semibold tracking-wider uppercase shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <Instagram className="h-4 w-4 text-[#F2C27B]" />
            <span>Follow {handle} On Instagram</span>
          </a>
        </div>
      </div>
    </section>
  );
}
