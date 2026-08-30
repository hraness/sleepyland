"use client";

import {
  HranessSiteFooter,
  type HranessSiteFooterProps,
} from "@hraness/site-footer/react";
import { usePathname } from "next/navigation";

export function SleepylandSiteFooter({
  mailingList,
}: Pick<HranessSiteFooterProps, "mailingList">) {
  const pathname = usePathname();

  if (pathname === "/noise") return null;

  return <HranessSiteFooter mailingList={mailingList} />;
}
