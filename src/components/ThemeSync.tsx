"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useProfile } from "@/hooks/useProfile";

export function ThemeSync() {
  const { profile } = useProfile();
  const { setTheme } = useTheme();

  const [hasInitialSync, setHasInitialSync] = useState(false);

  useEffect(() => {
    if (profile?.theme && !hasInitialSync) {
      setTheme(profile.theme);
      setHasInitialSync(true);
    }
  }, [profile?.theme, setTheme, hasInitialSync]);

  return null;
}
