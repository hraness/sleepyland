import { MARKDOWN_CONTENT_TYPE, sitemapMarkdown } from "../agent-access";

export const dynamic = "force-static";

export function GET() {
  return new Response(sitemapMarkdown(), {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Content-Type": MARKDOWN_CONTENT_TYPE,
      "Vary": "Accept",
    },
  });
}
