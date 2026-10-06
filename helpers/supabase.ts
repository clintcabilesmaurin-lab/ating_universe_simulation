import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Returns the browser-safe Supabase URL (VITE_SUPABASE_URL).
 */
export function getBrowserSupabaseUrl(): string | undefined {
  try {
    // @ts-ignore
    if (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) {
      // @ts-ignore
      const val = String(import.meta.env.VITE_SUPABASE_URL).trim();
      if (val.length > 0) return val;
    }
  } catch {}
  if (typeof process !== "undefined" && process.env?.VITE_SUPABASE_URL) {
    const val = process.env.VITE_SUPABASE_URL.trim();
    if (val.length > 0) return val;
  }
  return undefined;
}

/**
 * Returns the server Supabase URL (SUPABASE_URL or VITE_SUPABASE_URL).
 */
export function getServerSupabaseUrl(): string | undefined {
  if (typeof window !== "undefined") {
    return undefined;
  }
  if (typeof process !== "undefined" && process.env) {
    const serverUrl = process.env.SUPABASE_URL?.trim();
    if (serverUrl && serverUrl.length > 0) return serverUrl;
    const viteUrl = process.env.VITE_SUPABASE_URL?.trim();
    if (viteUrl && viteUrl.length > 0) return viteUrl;
  }
  return undefined;
}

/**
 * Returns the Supabase URL for the current execution context.
 */
export function getSupabaseUrl(): string | undefined {
  return typeof window === "undefined"
    ? getServerSupabaseUrl()
    : getBrowserSupabaseUrl();
}

/**
 * Returns the client-safe public Supabase key (VITE_SUPABASE_ANON_KEY).
 * Safe for browser execution, but holds NO table privileges on simulation tables.
 */
export function getSupabaseAnonKey(): string | undefined {
  try {
    // @ts-ignore
    if (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) {
      // @ts-ignore
      const val = String(import.meta.env.VITE_SUPABASE_ANON_KEY).trim();
      if (val.length > 0) return val;
    }
  } catch {}
  if (typeof process !== "undefined" && process.env?.VITE_SUPABASE_ANON_KEY) {
    const val = process.env.VITE_SUPABASE_ANON_KEY.trim();
    if (val.length > 0) return val;
  }
  return undefined;
}

/**
 * Returns the privileged server-only Supabase Secret Key (SUPABASE_SECRET_KEY).
 * CRITICAL:
 * - Strictly server-only (Node / Vercel serverless).
 * - NEVER falls back to VITE_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY.
 * - NEVER prefixed with VITE_ or exposed to the browser.
 */
export function getServerSupabaseKey(): string | undefined {
  if (typeof window !== "undefined") {
    return undefined;
  }
  if (typeof process !== "undefined" && process.env?.SUPABASE_SECRET_KEY) {
    const key = process.env.SUPABASE_SECRET_KEY.trim();
    if (key.length > 0) return key;
  }
  return undefined;
}

export function isServerSupabaseConfigured(): boolean {
  return Boolean(getServerSupabaseUrl() && getServerSupabaseKey());
}

export function isBrowserSupabaseConfigured(): boolean {
  return Boolean(getBrowserSupabaseUrl() && getSupabaseAnonKey());
}

export function isSupabaseConfigured(): boolean {
  return typeof window === "undefined"
    ? isServerSupabaseConfigured()
    : isBrowserSupabaseConfigured();
}

let cachedServerClient: SupabaseClient<any> | null = null;
let cachedBrowserClient: SupabaseClient<any> | null = null;

/**
 * Initializes or returns the browser-safe public Supabase client
 * using VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY.
 * Note: Simulation tables revoke anon/authenticated access; all simulation
 * persistence must go through server API endpoints.
 */
export function getBrowserSupabaseClient(): SupabaseClient<any> | null {
  const url = getBrowserSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!url || !anonKey) {
    return null;
  }

  if (!cachedBrowserClient) {
    cachedBrowserClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return cachedBrowserClient;
}

/**
 * Initializes or returns the privileged server-only Supabase client
 * using (SUPABASE_URL or VITE_SUPABASE_URL) + SUPABASE_SECRET_KEY ONLY.
 * Never downgrades to the publishable/anon key.
 */
export function getServerSupabaseClient(): SupabaseClient<any> | null {
  if (typeof window !== "undefined") {
    throw new Error(
      "[Supabase] Security violation: getServerSupabaseClient() cannot be invoked in browser context."
    );
  }

  const url = getServerSupabaseUrl();
  const secretKey = getServerSupabaseKey();

  if (!url || !secretKey) {
    return null;
  }

  if (!cachedServerClient) {
    cachedServerClient = createClient(url, secretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return cachedServerClient;
}

/**
 * Context-aware helper that delegates to getServerSupabaseClient() on the server
 * and getBrowserSupabaseClient() in the browser, without ever downgrading server
 * credentials to the anon key.
 */
export function getSupabaseClient(): SupabaseClient<any> | null {
  return typeof window === "undefined"
    ? getServerSupabaseClient()
    : getBrowserSupabaseClient();
}

