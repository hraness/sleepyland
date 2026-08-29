"use client";

import {
  DesignThemeProvider,
  ThemeColorSync,
} from "@hraness/design-kit/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function SleepylandThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const isStudio = pathname === "/noise";

  return (
    <DesignThemeProvider forcedTheme={isStudio ? "dark" : undefined}>
      <ThemeColorSync
        darkColor={isStudio ? "#080604" : "#151515"}
        lightColor="#ffffff"
      />
      {children}
    </DesignThemeProvider>
  );
}
