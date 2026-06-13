"use client";



import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { isProfileCompleteLocal } from "@/lib/profile-store";

import { getAuthMode, hasRemoteSession } from "@/lib/auth-session";



export function isProfileComplete(): boolean {

  return isProfileCompleteLocal();

}



export function useAuthGuard(): void {

  const router = useRouter();

  useEffect(() => {

    async function check() {

      const mode = getAuthMode();

      if (mode !== "local") {

        const signedIn = await hasRemoteSession();

        if (!signedIn) {

          router.replace("/");

          return;

        }

      }

      if (!isProfileCompleteLocal()) {

        router.replace("/");

      }

    }

    check();

  }, [router]);

}

