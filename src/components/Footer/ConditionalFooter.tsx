"use client";

import { usePathname } from "next/navigation";
import Footer from "./index";
import InstagramFeed from "./InstagramFeed";

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <>
      <InstagramFeed />
      <Footer />
    </>
  );
}
