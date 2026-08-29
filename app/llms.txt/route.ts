import { llmsTxt, PLAIN_TEXT_CONTENT_TYPE } from "../agent-access";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Content-Type": PLAIN_TEXT_CONTENT_TYPE,
    },
  });
}
