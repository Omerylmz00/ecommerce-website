import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xeipnbrzmyjbeskmrhpl.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlaXBuYnJ6bXlqYmVza21yaHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDA1NjcsImV4cCI6MjA2OTk3NjU2N30.BA1QENKAkMVtJdLyNHO0uGA2oYGlz1cJu5zyNiidis8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
