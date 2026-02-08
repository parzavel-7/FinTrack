"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useProfile } from "@/hooks/useProfile";

export function ThemeSync() {
  const { profile } = useProfile();
  const { setTheme, theme: currentTheme } = useTheme();

  useEffect(() => {
    if (profile?.theme && profile.theme !== currentTheme) {
      setTheme(profile.theme);
    }
  }, [profile?.theme, setTheme, currentTheme]);

  return null;
}
