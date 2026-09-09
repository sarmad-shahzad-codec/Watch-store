import ShopDetails from "@/components/ShopDetails";
import shopData from "@/components/Shop/shopData";
import { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const numId = Number(id);
  const product = shopData.find((p) => p.id === numId);
  return {
    title: product ? `${product.title} | Gloria Times` : "Product | Gloria Times",
    description: product
      ? `Shop ${product.title} at Gloria Times — luxury watches and curated timepieces.`
      : "Luxury watch product details at Gloria Times.",
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const numId = Number(id);
  return (
    <main>
      <ShopDetails productId={numId} />
    </main>
  );
}
