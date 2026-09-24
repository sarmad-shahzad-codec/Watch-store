export interface InstagramPost {
  id: string;
  post_url: string;
  image_url: string;
  caption?: string;
  likes?: string;
}

export interface InstagramSettings {
  id?: number;
  profile_url: string;
  handle: string;
  title: string;
  subtitle: string;
  enabled: boolean;
  posts: InstagramPost[];
  updated_at?: string;
}
