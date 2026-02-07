import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_DATABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
const isLocalPostgrest =
  supabaseUrl.includes("supabase-rest:3000") || supabaseUrl.includes("localhost:54321");

const postgrestCompatFetch: typeof fetch = async (input, init) => {
  const source = input instanceof Request ? input.url : input.toString();

  const rewritten = source
    .replace("/rest/v1/", "/")
    .replace(/\/rest\/v1(\?|$)/, "/$1");

  if (input instanceof Request) {
    return fetch(new Request(rewritten, input), init);
  }

  return fetch(rewritten, init);
};

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("SUPABASE_DATABASE_URL and SUPABASE_ANON_KEY must be set.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  global: isLocalPostgrest ? { fetch: postgrestCompatFetch } : {},
});

if (!supabaseServiceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY must be set.");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
  global: isLocalPostgrest ? { fetch: postgrestCompatFetch } : {},
});
