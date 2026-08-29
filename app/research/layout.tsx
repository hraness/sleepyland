import type { ReactNode } from "react";

import { ResearchShell, researchViewport } from "./research-shell";

export const viewport = researchViewport;

export default function ResearchLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <ResearchShell>{children}</ResearchShell>;
}
