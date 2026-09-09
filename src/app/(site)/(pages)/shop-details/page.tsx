import { redirect } from "next/navigation";

/** Legacy `/shop-details` — choose a product from the shop listing. */
export default function ShopDetailsLegacyPage() {
  redirect("/shop-without-sidebar");
}
