export type Testimonial = {
  id?: number | string;
  review: string;
  authorName: string;
  authorRole?: string;
  authorImg: string;
  watchModel?: string;
  rating?: number;
  displayOrder?: number;
  created_at?: string;
};
