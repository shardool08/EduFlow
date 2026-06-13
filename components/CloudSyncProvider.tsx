"use client";

import { useEffect } from "react";
import { pullFromCloud, scheduleProfileSync } from "@/lib/cloud-sync";
import { isCloudEnabled } from "@/lib/supabase/config";
import { tryCreateClient } from "@/lib/supabase/client";

/** Runs once on authenticated pages to pull cloud data and push pending local changes */
export function CloudSyncProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!isCloudEnabled()) return;

    (async () => {
      const supabase = tryCreateClient();
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

      await pullFromCloud();
      scheduleProfileSync();
    })();
  }, []);

  return <>{children}</>;
}
