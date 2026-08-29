import { AskAiAboutThis } from "@hraness/ui";

import { site } from "./site";

export type SleepylandPublicPath = "/" | `/${string}`;

export function sleepylandCanonicalSubject(path: SleepylandPublicPath): string {
  return path === "/" ? site.canonicalUrl : `${site.canonicalUrl}${path}`;
}

export function SleepylandAskAiAboutThis({
  className,
  path,
}: Readonly<{
  className?: string;
  path: SleepylandPublicPath;
}>) {
  return (
    <AskAiAboutThis
      className={["sleepyland-ask-ai", className].filter(Boolean).join(" ")}
      url={sleepylandCanonicalSubject(path)}
    />
  );
}
