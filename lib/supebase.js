import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
console.log("url:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
