import CategoryPageComponent from "@/components/CategoryPage";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brandName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const isAccessory = ["accessories", "watch-boxes", "tool-kits", "straps"].includes(slug.toLowerCase());

  if (isAccessory) {
    return {
      title: `${brandName} (Coming Soon) | Gloria Times Pakistan`,
      description: `Discover upcoming luxury ${brandName} at Gloria Times. Launching soon with nationwide delivery across Pakistan.`,
    };
  }

  return {
    title: `${brandName} Watches Collection | Gloria Times Pakistan`,
    description: `Explore authentic 1:1 luxury ${brandName} watches at Gloria Times. Cash on delivery nationwide with express shipping & 24-hour replacement assistance across Pakistan.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main>
      <CategoryPageComponent slug={slug} />
    </main>
  );
}
