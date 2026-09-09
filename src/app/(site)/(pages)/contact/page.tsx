import Contact from "@/components/Contact";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact Gloria Times | Luxury Watches Pakistan",
  description:
    "Get in touch with Gloria Times concierge. WhatsApp support, direct helpline, and physical boutique in Lahore, Pakistan.",
};

const ContactPage = () => {
  return (
    <main>
      <Contact />
    </main>
  );
};

export default ContactPage;
