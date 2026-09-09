import StaticPageShell from "@/components/Common/StaticPageShell";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Gloria Times",
  description:
    "How Gloria Times collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <StaticPageShell title="Privacy Policy">
      <p className="text-[13px] text-[#6B5344]">
        Last updated: May 2026. This policy describes how Gloria Times
        (&quot;we&quot;, &quot;us&quot;) handles personal data when you use our
        website and related services in Pakistan.
      </p>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[#1F1209]">
          Information we collect
        </h2>
        <p>
          We may collect contact details you provide (name, email, phone),
          delivery and billing addresses, order history, device and browser
          information, and communications you send to customer support.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[#1F1209]">
          How we use information
        </h2>
        <p>
          We use this data to process and deliver orders, respond to enquiries,
          improve our catalogue and website experience, prevent fraud, and meet
          legal obligations. Marketing emails are sent only where you have opted
          in, and you may unsubscribe at any time.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[#1F1209]">
          Sharing and retention
        </h2>
        <p>
          We may share limited data with payment processors, shipping partners,
          and IT providers strictly as needed to fulfil your purchase. We do not
          sell your personal information. We retain records only as long as
          required for orders, accounting, and applicable law.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[#1F1209]">Your rights</h2>
        <p>
          You may request access, correction, or deletion of your personal data
          where applicable. Contact us via the details on our{" "}
          <Link
            href="/contact"
            className="font-medium text-[#4A2F19] underline-offset-2 hover:underline"
          >
            Contact
          </Link>{" "}
          page.
        </p>
      </section>
      <p className="text-[13px] text-[#6B5344]">
        This summary is for transparency. For franchise or regulatory specifics,
        formal policies may be extended when Gloria Times connects live payments
        and logistics APIs.
      </p>
    </StaticPageShell>
  );
}
