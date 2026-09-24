import { Product } from "@/types/product";

/** All prices are Pakistani Rupees (PKR), whole rupees. Clean Gloria Times Luxury Catalog. */
const shopData: Product[] = [
  {
    id: 1,
    brand: "Tissot",
    category: "Men's Automatic Watches",
    title: "Tissot PRX 1853 Automatic",
    subtitle: "Men's Integrated Stainless Steel",
    reviews: 18,
    price: 3850,
    discountedPrice: 2999,
    costPrice: 1600,
    packingCost: 150,
    deliveryCost: 250,
    description:
      "The Tissot PRX captures seventies integrated-bracelet sport-chic in a slim profile built for daily wear. Its sunburst dial shifts under changing light, framed by a tonneau case with brushed surfaces and polished accents.\n\nInside beats a reliable movement with a smooth sweeping seconds hand—ideal if you want heritage styling without compromising everyday practicality.",
    careNotes:
      "Rinse briefly after saltwater or heavy sweat; dry with a soft cloth. Store flat or on a cushion to keep strap curvature even.",
    specs: [
      { label: "Brand", value: "Tissot" },
      { label: "Movement", value: "Semi-Automatic Sweeping" },
      { label: "Case material", value: "Stainless steel" },
      { label: "Case diameter", value: "40 mm" },
      { label: "Crystal", value: "Sapphire crystal" },
      { label: "Water resistance", value: "100 m / 10 bar" },
      { label: "Bracelet", value: "Integrated stainless steel" },
    ],
    imgs: {
      thumbnails: [
        "/images/hero-lineup/tissot.webp",
        "/images/hero-lineup/tissot-green.webp",
      ],
      previews: [
        "/images/hero-lineup/tissot.webp",
        "/images/hero-lineup/tissot-green.webp",
      ],
    },
    variants: [
      { name: "Cobalt Blue Dial", image: "/images/hero-lineup/tissot.webp", colorHex: "#1E3A8A" },
      { name: "Emerald Green Dial", image: "/images/hero-lineup/tissot-green.webp", colorHex: "#065F46" },
      { name: "Classic Silver Dial", image: "/images/hero-lineup/tagHeuer.webp", colorHex: "#E5E7EB" },
    ],
  },
  {
    id: 2,
    brand: "TAG Heuer",
    category: "Chronograph Sport",
    title: "TAG Heuer Carrera Calibre Chronograph",
    subtitle: "Men's Motorsport Steel Chrono",
    reviews: 22,
    price: 4450,
    discountedPrice: 3250,
    costPrice: 1550,
    packingCost: 150,
    deliveryCost: 250,
    description:
      "Precision racing chronograph inspired by high-octane motorsport timing. Features tachymeter scale bezel, balanced sub-dials, and solid stainless steel bracelet with double safety push-buttons.",
    careNotes:
      "Wipe bracelet with lint-free cloth; avoid extreme magnet exposure.",
    specs: [
      { label: "Brand", value: "TAG Heuer" },
      { label: "Model", value: "Carrera Chronograph" },
      { label: "Case diameter", value: "42 mm" },
      { label: "Movement", value: "High precision chronograph" },
      { label: "Crystal", value: "Sapphire crystal" },
      { label: "Bracelet", value: "Solid stainless steel" },
    ],
    imgs: {
      thumbnails: [
        "/images/hero-lineup/tagHeuer.webp",
        "/images/hero-lineup/tissot.webp",
      ],
      previews: [
        "/images/hero-lineup/tagHeuer.webp",
        "/images/hero-lineup/tissot.webp",
      ],
    },
    variants: [
      { name: "Pure White Dial", image: "/images/hero-lineup/tagHeuer.webp", colorHex: "#FFFFFF" },
      { name: "Sport Blue Dial", image: "/images/hero-lineup/tissot.webp", colorHex: "#1E3A8A" },
    ],
  },
  {
    id: 3,
    brand: "Hublot Diamond",
    category: "Diamond Bezel Luxury",
    title: "Hublot Diamond Cut Heavy Automatic",
    subtitle: "Men's Luxury Skeleton Rubber",
    reviews: 19,
    price: 4850,
    discountedPrice: 3499,
    costPrice: 1700,
    packingCost: 200,
    deliveryCost: 250,
    description:
      "Bold angular case design with heavy stainless steel construction, visible signature bezel screws, and exposed skeleton dial styling. High wrist presence for collectors.",
    careNotes:
      "Store flat or on a cushion to keep strap curvature even.",
    specs: [
      { label: "Brand", value: "Hublot Diamond" },
      { label: "Case diameter", value: "44 mm" },
      { label: "Crystal", value: "Sapphire crystal" },
      { label: "Movement", value: "Automatic sweeping movement" },
      { label: "Strap", value: "Textured rubber & steel clasp" },
    ],
    imgs: {
      thumbnails: [
        "/images/hero-lineup/hublot.webp",
        "/images/hero-lineup/tagHeuer.webp",
      ],
      previews: [
        "/images/hero-lineup/hublot.webp",
        "/images/hero-lineup/tagHeuer.webp",
      ],
    },
    variants: [
      { name: "Skeleton Black Rubber", image: "/images/hero-lineup/hublot.webp", colorHex: "#1F2937" },
      { name: "Solid Stainless Steel", image: "/images/hero-lineup/tagHeuer.webp", colorHex: "#9CA3AF" },
    ],
  },
  {
    id: 4,
    brand: "Rolex",
    category: "Diver Luxury Watches",
    title: "Rolex Submariner Ceramic Date",
    subtitle: "Men's Oystersteel Diver",
    reviews: 31,
    price: 4850,
    discountedPrice: 3650,
    costPrice: 1800,
    packingCost: 200,
    deliveryCost: 250,
    description:
      "The world's most recognizable luxury diver watch. Features rotating black ceramic bezel, magnified date cyclops window, and solid Oystersteel bracelet with glidelock clasp.",
    careNotes:
      "Rinse after chlorine or saltwater; wipe clean with soft cloth.",
    specs: [
      { label: "Brand", value: "Rolex" },
      { label: "Model family", value: "Submariner Date" },
      { label: "Case material", value: "Oystersteel" },
      { label: "Case diameter", value: "41 mm" },
      { label: "Bezel", value: "Ceramic unidirectional" },
    ],
    imgs: {
      thumbnails: [
        "/images/hero-lineup/rolex-submariner.jpg",
        "/images/hero-lineup/rolex-jubilee.webp",
      ],
      previews: [
        "/images/hero-lineup/rolex-submariner.jpg",
        "/images/hero-lineup/rolex-jubilee.webp",
      ],
    },
    variants: [
      { name: "Black Ceramic Dial", image: "/images/hero-lineup/rolex-submariner.jpg", colorHex: "#111827" },
      { name: "Two-Tone Gold & Steel", image: "/images/hero-lineup/rolex-jubilee.webp", colorHex: "#D97706" },
    ],
  },
  {
    id: 5,
    brand: "Rolex",
    category: "Classic Dress Watches",
    title: "Rolex Datejust Jubilee Fluted Bezel",
    subtitle: "Men's Fluted Jubilee Two-Tone",
    reviews: 24,
    price: 4450,
    discountedPrice: 3450,
    costPrice: 1650,
    packingCost: 200,
    deliveryCost: 250,
    description:
      "Classic fluted bezel luxury watch with iconic 5-link jubilee bracelet. Features clean date magnifier, sweeping hands, and premium heavy build.",
    careNotes:
      "Wipe with microfibre cloth; store in protective box.",
    specs: [
      { label: "Brand", value: "Rolex" },
      { label: "Case material", value: "Oystersteel & Gold" },
      { label: "Case diameter", value: "41 mm" },
      { label: "Bracelet", value: "Jubilee 5-link" },
      { label: "Movement", value: "Semi-automatic sweeping" },
    ],
    imgs: {
      thumbnails: [
        "/images/hero-lineup/rolex-jubilee.webp",
        "/images/hero-lineup/rolex-submariner.jpg",
      ],
      previews: [
        "/images/hero-lineup/rolex-jubilee.webp",
        "/images/hero-lineup/rolex-submariner.jpg",
      ],
    },
    variants: [
      { name: "Two-Tone Gold & Steel", image: "/images/hero-lineup/rolex-jubilee.webp", colorHex: "#D97706" },
      { name: "Black Ceramic Oystersteel", image: "/images/hero-lineup/rolex-submariner.jpg", colorHex: "#111827" },
    ],
  },
  {
    id: 6,
    brand: "Patek Philippe",
    category: "Prestige Haute Horlogerie",
    title: "Patek Philippe Nautilus Automatic",
    subtitle: "Men's Luxury Stainless Steel",
    reviews: 28,
    price: 5450,
    discountedPrice: 3850,
    costPrice: 1900,
    packingCost: 200,
    deliveryCost: 250,
    description:
      "The epitome of haute horlogerie elegance. Features the iconic rounded octagonal bezel, horizontally embossed dial, and integrated steel bracelet with butterfly clasp.",
    careNotes:
      "Store on cushion; polish case gently with microfibre cloth.",
    specs: [
      { label: "Brand", value: "Patek Philippe" },
      { label: "Model", value: "Nautilus Automatic" },
      { label: "Case material", value: "Stainless steel" },
      { label: "Case diameter", value: "40 mm" },
      { label: "Movement", value: "Automatic mechanical" },
    ],
    imgs: {
      thumbnails: [
        "/images/hero-lineup/main.webp",
        "/images/hero-lineup/tagHeuer.webp",
      ],
      previews: [
        "/images/hero-lineup/main.webp",
        "/images/hero-lineup/tagHeuer.webp",
      ],
    },
    variants: [
      { name: "Moonphase Blue Dial", image: "/images/hero-lineup/main.webp", colorHex: "#1E3A8A" },
      { name: "Pure Silver Dial", image: "/images/hero-lineup/tagHeuer.webp", colorHex: "#E5E7EB" },
    ],
  },
  {
    id: 7,
    brand: "Cartier",
    category: "Men's Automatic Watches",
    title: "Cartier Santos De Cartier Automatic",
    subtitle: "Men's Square Roman Steel",
    reviews: 26,
    price: 4950,
    discountedPrice: 3250,
    costPrice: 1600,
    packingCost: 200,
    deliveryCost: 250,
    description:
      "Timeless square silhouette with rounded corners, exposed bezel screws, and Roman numeral dial. Equipped with QuickSwitch interchangeable bracelet mechanism.",
    careNotes: "Avoid magnetic fields; store flat on soft cushion.",
    specs: [
      { label: "Brand", value: "Cartier" },
      { label: "Model", value: "Santos Automatic" },
      { label: "Case size", value: "39.8 mm" },
      { label: "Bezel", value: "Polished steel with screws" },
      { label: "Movement", value: "Automatic mechanical" },
    ],
    imgs: {
      thumbnails: [
        "/images/hero-lineup/cartier.webp",
        "/images/hero-lineup/tissot.webp",
      ],
      previews: [
        "/images/hero-lineup/cartier.webp",
        "/images/hero-lineup/tissot.webp",
      ],
    },
    variants: [
      { name: "White Roman Dial", image: "/images/hero-lineup/cartier.webp", colorHex: "#FFFFFF" },
      { name: "Cobalt Sunburst Dial", image: "/images/hero-lineup/tissot.webp", colorHex: "#1E3A8A" },
    ],
  },
  {
    id: 8,
    brand: "Rolex",
    category: "Chronograph Sport",
    title: "Rolex Cosmograph Daytona Ceramic",
    subtitle: "Men's Oyster Perpetual Chronograph",
    reviews: 29,
    price: 5200,
    discountedPrice: 3850,
    costPrice: 1800,
    packingCost: 200,
    deliveryCost: 250,
    description:
      "The benchmark for those with a passion for driving and speed. Features high-contrast sub-dials, engraved tachymetric bezel, and reliable sweeping movement.",
    careNotes: "Store flat or on a watch cushion; wipe clean with microfibre cloth.",
    specs: [
      { label: "Brand", value: "Rolex" },
      { label: "Model family", value: "Cosmograph Daytona" },
      { label: "Case diameter", value: "40 mm" },
      { label: "Bezel", value: "Black Cerachrom with tachymeter" },
      { label: "Movement", value: "Semi-automatic chronograph" },
    ],
    imgs: {
      thumbnails: [
        "/images/2s/rolex-daytona-1.jpg",
        "/images/2s/rolex-daytona-2.jpg",
      ],
      previews: [
        "/images/2s/rolex-daytona-1.jpg",
        "/images/2s/rolex-daytona-2.jpg",
      ],
    },
    variants: [
      { name: "Panda White Dial", image: "/images/2s/rolex-daytona-1.jpg", colorHex: "#FFFFFF" },
      { name: "Stealth Black Dial", image: "/images/2s/rolex-daytona-2.jpg", colorHex: "#111827" },
    ],
  },
  {
    id: 9,
    brand: "Rolex",
    category: "Diver Luxury Watches",
    title: "Rolex GMT-Master II Dual Time",
    subtitle: "Men's Batman Blue & Black Bezel",
    reviews: 35,
    price: 4950,
    discountedPrice: 3650,
    costPrice: 1750,
    packingCost: 200,
    deliveryCost: 250,
    description:
      "Designed to show the time in two different time zones simultaneously. Fitted with a two-colour ceramic bezel insert and comfortable jubilee bracelet.",
    careNotes: "Rinse gently under tap water after exposure to dust or sea water.",
    specs: [
      { label: "Brand", value: "Rolex" },
      { label: "Model family", value: "GMT-Master II" },
      { label: "Case diameter", value: "40 mm" },
      { label: "Bezel", value: "Bi-directional 24-hour ceramic" },
      { label: "Bracelet", value: "Jubilee 5-piece links" },
    ],
    imgs: {
      thumbnails: [
        "/images/2s/rolex-gmt-1.jpg",
        "/images/2s/rolex-gmt-2.jpg",
      ],
      previews: [
        "/images/2s/rolex-gmt-1.jpg",
        "/images/2s/rolex-gmt-2.jpg",
      ],
    },
    variants: [
      { name: "Batman Blue & Black", image: "/images/2s/rolex-gmt-1.jpg", colorHex: "#1E3A8A" },
      { name: "Pepsi Red & Blue", image: "/images/2s/rolex-gmt-2.jpg", colorHex: "#DC2626" },
    ],
  },
  {
    id: 10,
    brand: "Cartier",
    category: "Classic Dress Watches",
    title: "Cartier Tank Française Steel",
    subtitle: "Classic Rectangular Roman Dial",
    reviews: 21,
    price: 4250,
    discountedPrice: 2999,
    costPrice: 1500,
    packingCost: 150,
    deliveryCost: 250,
    description:
      "The quintessential French luxury dress watch with clean rectangular proportions, blued-steel sword hands, and sapphire cabochon crown.",
    careNotes: "Clean bracelet with a soft dry cloth; avoid chemical cleaners.",
    specs: [
      { label: "Brand", value: "Cartier" },
      { label: "Model", value: "Tank Française" },
      { label: "Case material", value: "Polished stainless steel" },
      { label: "Movement", value: "High precision sweeping" },
      { label: "Crystal", value: "Scratch-resistant sapphire" },
    ],
    imgs: {
      thumbnails: [
        "/images/2s/cartier-tank-1.jpg",
        "/images/2s/cartier-tank-2.jpg",
      ],
      previews: [
        "/images/2s/cartier-tank-1.jpg",
        "/images/2s/cartier-tank-2.jpg",
      ],
    },
    variants: [
      { name: "Silver Roman Dial", image: "/images/2s/cartier-tank-1.jpg", colorHex: "#F3F4F6" },
      { name: "Opaline Cream Dial", image: "/images/2s/cartier-tank-2.jpg", colorHex: "#FEF3C7" },
    ],
  },
];

export default shopData;

