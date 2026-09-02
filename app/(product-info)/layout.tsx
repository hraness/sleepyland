import { SkipLink } from "@/lib/ui";
import { ThemeMenuButton } from "@hraness/design-kit/react";
import Link from "next/link";
import type { Viewport } from "next";
import type { ReactNode } from "react";

import { repositoryUrl } from "../site";

export const viewport = {
  colorScheme: "light dark",
  themeColor: [
    { color: "#ffffff", media: "(prefers-color-scheme: light)" },
    { color: "#151515", media: "(prefers-color-scheme: dark)" },
  ],
  viewportFit: "cover",
} satisfies Viewport;

export default function ProductInfoLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="plain-site sleepyland-product-info">
      <SkipLink href="#product-info-content">Skip to content</SkipLink>
      <header className="plain-header">
        <div className="plain-header__inner">
          <Link className="plain-wordmark" href="/">
            Sleepyland
          </Link>
          <div className="plain-header__actions">
            <nav aria-label="Product navigation" className="plain-nav">
              <Link href="/about">About</Link>
              <Link href="/demo">Demo</Link>
              <Link href="/">Research</Link>
              <Link href="/noise">Sound machine</Link>
              <Link href="/support">Support</Link>
            </nav>
            <ThemeMenuButton aria-label="Appearance" />
          </div>
        </div>
      </header>
      {children}
      <nav aria-label="Sleepyland resources" className="sleepyland-resource-nav">
        <Link href="/">Research</Link>
        <Link href="/noise">Sound machine</Link>
        <Link href="/about">About</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/accessibility">Accessibility</Link>
        <Link href="/license">License</Link>
        <Link href="/support">Support</Link>
        <a href={repositoryUrl}>GitHub</a>
      </nav>
    </div>
  );
}
