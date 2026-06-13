import { createBrowserClient } from "@supabase/ssr";
import { isCloudEnabled } from "@/lib/supabase/config";

export function createClient() {
  if (!isCloudEnabled()) {
    throw new Error("Supabase is not configured");
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function tryCreateClient() {
  if (!isCloudEnabled()) return null;
  return createClient();
}
