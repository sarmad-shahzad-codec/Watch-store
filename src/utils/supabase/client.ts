import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://kjpabohshfuhwlwrexqh.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqcGFib2hzaGZ1aHdsd3JleHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NjI0MzUsImV4cCI6MjEwNDQzODQzNX0.5zK4EXKcN1zskkIeN1xLdClGeOrhW2jOWhjlu6T1ySQ";

export const createClient = () =>
  createBrowserClient(supabaseUrl, supabaseKey);
