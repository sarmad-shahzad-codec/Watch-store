export interface HeroSlide {
  id: string | number;
  image: string;
  badge: string;
  model: string;
  price: string;
  category?: string;
  link: string;
  description?: string;
}

export interface CategoryCardItem {
  title: string;
  image: string;
  link: string;
}

export interface HeroSettings {
  id?: number;
  collection_tag: string;
  headline: string;
  description: string;
  primary_btn_text: string;
  primary_btn_link: string;
  secondary_btn_text: string;
  secondary_btn_link: string;
  men_card: CategoryCardItem;
  women_card: CategoryCardItem;
  slides: HeroSlide[];
  updated_at?: string;
}
