import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// console.log("url:", process.env.NEXT_PUBLIC_SUPABASE_URL);
// console.log("key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey =
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
export const supabase = createClient(supabaseUrl, supabaseKey);
