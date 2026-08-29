import { researchFeedXml } from "../search-discovery";

export const dynamic = "force-static";

export function GET() {
  return new Response(researchFeedXml(), {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
