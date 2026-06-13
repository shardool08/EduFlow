"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirebaseConfig, isFirebaseEnabled } from "@/lib/firebase/config";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

export function tryGetFirebaseAuth(): Auth | null {
  if (!isFirebaseEnabled()) return null;
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(getFirebaseConfig());
  }
  if (!auth) {
    auth = getAuth(app);
  }
  return auth;
}
