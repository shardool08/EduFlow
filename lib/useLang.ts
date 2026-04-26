import { useSyncExternalStore } from "react";
import type { Language } from "./translations";

function getLangSnapshot(): Language {
  return (localStorage.getItem("lang") as Language) ?? "mr";
}

function getServerSnapshot(): Language {
  return "mr";
}

export function useLang(): Language {
  return useSyncExternalStore(() => () => {}, getLangSnapshot, getServerSnapshot);
}
