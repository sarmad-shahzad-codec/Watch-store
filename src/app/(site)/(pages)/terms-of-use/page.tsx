import StaticPageShell from "@/components/Common/StaticPageShell";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | Gloria Times",
  description:
    "Terms and conditions for using the Gloria Times website and services.",
};

export default function TermsOfUsePage() {
  return (
    <StaticPageShell title="Terms of Use">
      <p className="text-[13px] text-[#6B5344]">
        By accessing{" "}
        <Link
          href="/"
          className="font-medium text-[#4A2F19] underline-offset-2 hover:underline"
        >
          gloriatimes.com
        </Link>{" "}
        (or this deployment of the Gloria Times storefront), you agree to these
        terms. If you do not agree, please do not use the site.
      </p>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[#1F1209]">Use of the site</h2>
        <p>
          You agree to use the website only for lawful purposes. You may not
          attempt to gain unauthorised access, interfere with security, scrape
          content in bulk, or misrepresent your identity.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[#1F1209]">
          Products & availability
        </h2>
        <p>
          Descriptions, images, and prices are published in good faith. Luxury
          references and stock levels may be updated without notice. We reserve
          the right to cancel an order if a listing was manifestly incorrect or
          the item is no longer available.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[#1F1209]">
          Intellectual property
        </h2>
        <p>
          Gloria Times branding and original site content belong to Gloria Times
          or its licensors. Watch brands featured remain trademarks of their
          respective owners.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[#1F1209]">
          Limitation of liability
        </h2>
        <p>
          To the extent permitted by law, Gloria Times is not liable for
          indirect or consequential loss arising from use of the site. Nothing
          in these terms limits liability that cannot be excluded under
          applicable law in Pakistan.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[#1F1209]">Contact</h2>
        <p>
          Questions about these terms: see our{" "}
          <Link
            href="/contact"
            className="font-medium text-[#4A2F19] underline-offset-2 hover:underline"
          >
            Contact
          </Link>{" "}
          page.
        </p>
      </section>
    </StaticPageShell>
  );
}
