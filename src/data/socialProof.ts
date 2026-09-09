import shopData from "@/components/Shop/shopData";

export type SocialProofAction = "purchased" | "ordered" | "received";

export type SocialProofEntry = {
  customerName: string;
  city: string;
  action: SocialProofAction;
  /** Index into `shopData` */
  productIndex: number;
  timeLabel: string;
};

/** Demo notifications — rotate on the storefront for social proof */
export const SOCIAL_PROOF_EVENTS: SocialProofEntry[] = [
  {
    customerName: "Khalil",
    city: "Gujrat",
    action: "purchased",
    productIndex: 0,
    timeLabel: "25 minutes ago",
  },
  {
    customerName: "Ali",
    city: "Hasilpur",
    action: "ordered",
    productIndex: 3,
    timeLabel: "2 hours ago",
  },
  {
    customerName: "Sara",
    city: "Islamabad",
    action: "received",
    productIndex: 2,
    timeLabel: "18 minutes ago",
  },
  {
    customerName: "Omar",
    city: "Karachi",
    action: "purchased",
    productIndex: 4,
    timeLabel: "54 minutes ago",
  },
  {
    customerName: "Zainab",
    city: "Lahore",
    action: "ordered",
    productIndex: 1,
    timeLabel: "3 hours ago",
  },
  {
    customerName: "Usman",
    city: "Faisalabad",
    action: "purchased",
    productIndex: 5,
    timeLabel: "12 minutes ago",
  },
  {
    customerName: "Hina",
    city: "Multan",
    action: "received",
    productIndex: 6,
    timeLabel: "1 hour ago",
  },
  {
    customerName: "Bilal",
    city: "Rawalpindi",
    action: "ordered",
    productIndex: 7,
    timeLabel: "40 minutes ago",
  },
];

export function getSocialProofProduct(productIndex: number) {
  const safe =
    ((productIndex % shopData.length) + shopData.length) % shopData.length;
  const p = shopData[safe];
  const img =
    p.imgs?.thumbnails?.[0] ?? "/images/tissot.webp";
  return { title: p.title, imageSrc: img, id: p.id };
}

export function actionVerb(action: SocialProofAction): string {
  switch (action) {
    case "ordered":
      return "placed an order";
    case "received":
      return "received delivery";
    default:
      return "purchased";
  }
}
