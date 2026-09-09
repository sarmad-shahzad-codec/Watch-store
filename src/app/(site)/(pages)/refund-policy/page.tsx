import StaticPageShell from "@/components/Common/StaticPageShell";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Replacement Policy | Gloria Times",
  description:
    "Official 24-Hour Replacement Policy for Gloria Times luxury watches. Strictly replacement only — no returns or refunds.",
};

export default function RefundPolicyPage() {
  return (
    <StaticPageShell title="Replacement Policy (No Returns / No Refunds)">
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 text-amber-950 font-medium text-sm sm:text-base leading-relaxed">
        <p className="font-bold text-base sm:text-lg mb-1 text-[#4A2F19]">
          ⚠️ Important Notice: Replacement Only
        </p>
        <p>
          Gloria Times operates strictly on a <strong>Replacement-Only Policy</strong>. We do <strong>NOT</strong> offer cash returns or order cancellations once a parcel is delivered. In the event of any damage or defect, we provide a direct 1-to-1 replacement for your timepiece.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-[#1F1209]">
          1. Strict 24-Hour Claim Window
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-gray-700">
          To be eligible for a replacement, you <strong>MUST contact our official customer support within 24 hours</strong> of receiving your parcel from the courier rider. Claims made after 24 hours of delivery cannot be entertained under any circumstances.
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-gray-700">
          Please contact our official WhatsApp concierge immediately at{" "}
          <a
            href="https://wa.me/923257982233?text=Assalam%20o%20Alaikum%20Gloria%20Times%2C%20I%20want%20to%20claim%20a%20replacement%20within%2024%20hours"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-emerald-700 underline"
          >
            0325-7982233
          </a>{" "}
          with your order details.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-[#1F1209]">
          2. What is Eligible for Replacement?
        </h2>
        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700">
          <li>
            <strong>Transit Damage:</strong> Watch arrived with cracked glass, damaged bracelet, or exterior dents during shipping.
          </li>
          <li>
            <strong>Movement Defect:</strong> The watch is non-functional or has a mechanical defect right out of the box.
          </li>
          <li>
            <strong>Wrong Item Received:</strong> The timepiece or dial color received does not match what you ordered.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-[#1F1209]">
          3. Verification Requirements
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-gray-700">
          When contacting our team within the 24-hour window, you must provide:
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-sm sm:text-base text-gray-700">
          <li>Photos and/or a short unboxing video of the watch and flyer.</li>
          <li>The watch must be unworn, with all protective plastic wrappings and stickers intact.</li>
          <li>Original luxury box, warranty card, and accessories must be present.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-[#1F1209]">
          4. How Replacement is Processed
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-gray-700">
          Once your claim is approved on WhatsApp, our team will dispatch a fresh, brand-new replacement timepiece to your address via express courier. Delivery of the replacement takes 2 to 4 business days.
        </p>
      </section>

      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs sm:text-sm text-gray-500">
          For any replacement queries, visit our{" "}
          <Link href="/contact" className="font-semibold text-black underline">
            Contact Page
          </Link>{" "}
          or WhatsApp our concierge at <strong>0325-7982233</strong>.
        </p>
      </div>
    </StaticPageShell>
  );
}
