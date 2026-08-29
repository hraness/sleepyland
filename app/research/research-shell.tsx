import { SkipLink } from "@/lib/ui";
import { ThemeMenuButton } from "@hraness/design-kit/react";
import Link from "next/link";
import type { Viewport } from "next";
import type { ReactNode } from "react";

import { repositoryUrl, researchContributionUrl } from "../site";

export const researchViewport = {
  colorScheme: "light dark",
  themeColor: [
    { color: "#ffffff", media: "(prefers-color-scheme: light)" },
    { color: "#151515", media: "(prefers-color-scheme: dark)" },
  ],
  viewportFit: "cover",
} satisfies Viewport;

export function ResearchShell({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="plain-site plain-publication sleepyland-research">
      <SkipLink href="#research-content">Skip to research</SkipLink>
      <header className="plain-header">
        <div className="plain-header__inner">
          <Link className="plain-wordmark" href="/">
            Sleepyland Research
          </Link>
          <div className="plain-header__actions">
            <nav aria-label="Research navigation" className="plain-nav">
              <a href={repositoryUrl}>GitHub</a>
              <Link className="plain-header__primary-action" href="/noise">
                Open sound machine
              </Link>
            </nav>
            <ThemeMenuButton
              aria-label="Appearance"
              className="research-header-appearance"
            />
          </div>
        </div>
      </header>
      {children}
      <nav aria-label="Sleepyland research resources" className="sleepyland-resource-nav">
        <Link href="/noise">Sound machine</Link>
        <Link href="/reading">Reading</Link>
        <Link href="/about">About</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/support">Support</Link>
        <a href={researchContributionUrl}>Contribute research</a>
        <a href={repositoryUrl}>GitHub</a>
      </nav>
    </div>
  );
}
