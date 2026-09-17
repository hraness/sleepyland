"use client";

import {
  DesignPaletteProvider,
  ThemeColorSync,
} from "@hraness/design-kit/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function SleepylandThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const isStudio = pathname === "/noise";

  return (
    <DesignPaletteProvider
      defaultPreference={{ palette: "paper", mode: "system" }}
      forcedPreference={isStudio ? { palette: "paper", mode: "dark" } : undefined}
    >
      <ThemeColorSync
        darkColor="#12100f"
        lightColor={isStudio ? "#12100f" : "#f8f7f4"}
      />
      {children}
    </DesignPaletteProvider>
  );
}
