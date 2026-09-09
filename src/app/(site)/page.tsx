import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gloria Times | Luxury Watch Store",
  description:
    "Gloria Times is your destination for timeless luxury watches, featuring curated collections of classic and modern timepieces.",
  // other metadata
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
