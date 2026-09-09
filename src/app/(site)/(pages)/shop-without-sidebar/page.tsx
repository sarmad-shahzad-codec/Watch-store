import React from "react";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shop luxury watches | Gloria Times",
  description:
    "Browse Gloria Times — curated Tissot, TAG Heuer, Hublot, Patek, Rolex, and exclusive editions. View details and add to cart.",
};

const ShopWithoutSidebarPage = () => {
  return (
    <main>
      <ShopWithoutSidebar />
    </main>
  );
};

export default ShopWithoutSidebarPage;
