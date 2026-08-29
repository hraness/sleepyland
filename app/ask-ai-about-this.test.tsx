import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import ProductInfoPage from "./(product-info)/[slug]/page";
import ReadingNotePage from "./(product-info)/reading/[slug]/page";
import Home from "./page";
import { PRODUCT_PAGES } from "./product-pages";
import { READING_NOTES } from "./reading-notes";
import { researchArticlePath, researchArticles } from "./research/articles";
import ResearchArticlePage from "./research/[slug]/page";

const providers = [
  ["ChatGPT", "https://chatgpt.com/?q="],
  ["Claude", "https://claude.ai/new?q="],
  ["Perplexity", "https://perplexity.ai/?q="],
  ["Grok", "https://x.com/i/grok?text="],
] as const;

function askAiMarkup(html: string): string {
  return html.match(/<nav\b[^>]*aria-label="Ask AI about this"[\s\S]*?<\/nav>/u)?.[0] ?? "";
}

function expectAskAi(html: string, subject: string): void {
  const askAi = askAiMarkup(html);
  const prompt = new URLSearchParams({ q: `Tell me about ${subject}` }).toString().slice(2);

  expect(html.match(/aria-label="Ask AI about this"/gu)).toHaveLength(1);
  expect(askAi.match(/<a\b/gu)).toHaveLength(4);
  for (const [provider, origin] of providers) {
    expect(askAi).toContain(`data-ask-ai-provider="${provider.toLowerCase()}"`);
    expect(askAi).toContain(`>${provider}</span>`);
    expect(askAi).toContain(`href="${origin}${prompt}"`);
  }
  expect(askAi.match(/target="_blank"/gu)).toHaveLength(4);
  expect(askAi.match(/rel="noopener noreferrer nofollow"/gu)).toHaveLength(4);
}

describe("Sleepyland Ask AI coverage", () => {
  test("server-renders exact provider links for the public product root", () => {
    expectAskAi(renderToStaticMarkup(<Home />), "https://sleepy.land");
  });

  test("covers every indexed product information route", async () => {
    for (const page of PRODUCT_PAGES) {
      const html = renderToStaticMarkup(
        await ProductInfoPage({ params: Promise.resolve({ slug: page.slug }) }),
      );
      expectAskAi(html, `https://sleepy.land${page.path}`);
    }
  });

  test("covers every indexed reading note", async () => {
    for (const note of READING_NOTES) {
      const html = renderToStaticMarkup(
        await ReadingNotePage({ params: Promise.resolve({ slug: note.slug }) }),
      );
      expectAskAi(html, `https://sleepy.land${note.path}`);
    }
  });

  test("covers every indexed research article", async () => {
    for (const article of researchArticles) {
      const path = researchArticlePath(article.slug);
      const html = renderToStaticMarkup(
        await ResearchArticlePage({ params: Promise.resolve({ slug: article.slug }) }),
      );
      expectAskAi(html, `https://sleepy.land${path}`);
    }
  });

  test("excludes non-indexed design and not-found routes", async () => {
    for (const path of ["./design/page.tsx", "./not-found.tsx"]) {
      const source = await Bun.file(new URL(path, import.meta.url)).text();
      expect(source).not.toContain("SleepylandAskAiAboutThis");
      expect(source).not.toContain("AskAiAboutThis");
    }
  });
});
