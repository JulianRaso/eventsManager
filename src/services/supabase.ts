import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
import { Database } from "../../database.types";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("There was an error loading the database");
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export { supabase, supabaseUrl };
