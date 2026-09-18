import { SkipLink } from "@/lib/ui";
import { ThemeMenuButton } from "@hraness/design-kit/react";
import Link from "next/link";
import type { Viewport } from "next";
import type { ReactNode } from "react";

import { repositoryUrl, researchContributionUrl } from "../site";

export const researchViewport = {
  colorScheme: "light dark",
  themeColor: [
    { color: "#f8f7f4", media: "(prefers-color-scheme: light)" },
    { color: "#12100f", media: "(prefers-color-scheme: dark)" },
  ],
  viewportFit: "cover",
} satisfies Viewport;

export function ResearchShell({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="plain-site plain-publication sleepyland-research">
      <SkipLink href="#research-content">Skip to research</SkipLink>
      <header className="plain-header hraness-material-chrome">
        <div className="plain-header__inner">
          <Link className="plain-wordmark" href="/research">
            {/* eslint-disable-next-line @next/next/no-img-element -- the canonical mark is a fixed-size authored SVG */}
            <img alt="" aria-hidden="true" height={20} src="/marks/sleepyland.svg" width={20} />{" "}
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
        <Link href="/about">About</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/support">Support</Link>
        <a href={researchContributionUrl}>Contribute research</a>
        <a href={repositoryUrl}>GitHub</a>
      </nav>
    </div>
  );
}
