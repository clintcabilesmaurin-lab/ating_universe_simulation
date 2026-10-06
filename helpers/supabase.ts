import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Returns the Supabase URL from environment variables.
 * Checks server process.env first, then Vite import.meta.env.
 */
export function getSupabaseUrl(): string | undefined {
  if (typeof process !== "undefined" && process.env) {
    if (process.env.SUPABASE_URL) return process.env.SUPABASE_URL;
    if (process.env.VITE_SUPABASE_URL) return process.env.VITE_SUPABASE_URL;
  }
  // Vite client bundle access
  try {
    // @ts-ignore
    if (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) {
      // @ts-ignore
      return import.meta.env.VITE_SUPABASE_URL;
    }
  } catch {}
  return undefined;
}

/**
 * Returns the client-safe public Supabase key (anon key).
 * Safe for browser execution.
 */
export function getSupabaseAnonKey(): string | undefined {
  if (typeof process !== "undefined" && process.env) {
    if (process.env.SUPABASE_ANON_KEY) return process.env.SUPABASE_ANON_KEY;
    if (process.env.VITE_SUPABASE_ANON_KEY) return process.env.VITE_SUPABASE_ANON_KEY;
  }
  try {
    // @ts-ignore
    if (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_SUPABASE_ANON_KEY;
    }
  } catch {}
  return undefined;
}

/**
 * Returns the privileged server-only Supabase service-role key.
 * CRITICAL: This MUST ONLY be accessed on the server (Node/Vercel serverless).
 * NEVER prefix with VITE_ or expose to the frontend.
 */
export function getServerSupabaseKey(): string | undefined {
  // If in browser, strictly return undefined to prevent credential leaks
  if (typeof window !== "undefined") {
    return undefined;
  }
  if (typeof process !== "undefined" && process.env) {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return process.env.SUPABASE_SERVICE_ROLE_KEY;
    }
  }
  return getSupabaseAnonKey();
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getServerSupabaseKey() || getSupabaseAnonKey();
  return Boolean(url && key && url.trim().length > 0 && key.trim().length > 0);
}

let cachedServerClient: SupabaseClient<any> | null = null;
let cachedClientClient: SupabaseClient<any> | null = null;

/**
 * Get or initialize the Supabase client.
 * Automatically chooses server-privileged or client-safe instance depending on context.
 */
export function getSupabaseClient(): SupabaseClient<any> | null {
  const url = getSupabaseUrl();
  const isServer = typeof window === "undefined";
  const key = isServer ? getServerSupabaseKey() : getSupabaseAnonKey();

  if (!url || !key) {
    return null;
  }

  if (isServer) {
    if (!cachedServerClient) {
      cachedServerClient = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    }
    return cachedServerClient;
  } else {
    if (!cachedClientClient) {
      cachedClientClient = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    }
    return cachedClientClient;
  }
}
