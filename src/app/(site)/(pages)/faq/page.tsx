import Link from "next/link";
import type { Metadata } from "next";
import ProductFaq from "@/components/Common/ProductFaq";

export const metadata: Metadata = {
  title: "FAQ | Gloria Times",
  description:
    "Frequently asked questions about ordering, authenticity, and service at Gloria Times.",
};

export default function FaqPage() {
  return (
    <div className="bg-[#050505] min-h-screen pt-12 pb-20">
      <ProductFaq
        title="Frequently Asked Questions"
        subtitle="Quick answers about buying luxury timepieces with Gloria Times Pakistan"
      />
    </div>
  );
}
