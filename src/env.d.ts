/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SUPABASE_DATABASE_URL: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
  readonly SUPABASE_ANON_KEY: string;
  readonly SUPABASE_JWT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
