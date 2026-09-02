import { describe, expect, test } from "bun:test";

import { GET as getLlmsTxt } from "./llms.txt/route";
import { GET as getSitemapMarkdown } from "./sitemap.md/route";
import {
  AI_CRAWLER_USER_AGENTS,
  MARKDOWN_CONTENT_TYPE,
  NOISE_DOCUMENT_PARAGRAPHS,
  NOISE_HEADING,
  PLAIN_TEXT_CONTENT_TYPE,
  appendVaryAccept,
  homepageDocumentText,
  homepageMarkdown,
  isKnownContentPath,
  llmsTxt,
  markdownAlternatePath,
  markdownForPath,
  negotiateAgentAccess,
  noiseMarkdown,
  notFoundMarkdown,
  parseAccept,
  preferredProducedType,
  productPageMarkdown,
  researchArticleMarkdown,
  researchIndexMarkdown,
  sitemapMarkdown,
} from "./agent-access";
import {
  homepageAgentRequest,
} from "./homepage-content";
import { PRODUCT_PAGES } from "./product-pages";
import {
  CLINICAL_REVIEW_REQUIRED_RESEARCH_SLUGS,
  getResearchArticle,
  isIndexableResearchArticle,
  researchArticlePath,
  researchArticles,
  researchArticlesNewestFirst,
} from "./research/articles";

function request(
  path: string,
  headers: Readonly<Record<string, string>> = {},
  method = "GET",
): Request {
  return new Request(`https://sleepy.land${path}`, { headers, method });
}

async function negotiated(path: string, headers: Readonly<Record<string, string>> = {}) {
  const decision = negotiateAgentAccess(request(path, headers));

  if (decision.kind !== "respond") {
    throw new Error(`Expected a response for ${path}`);
  }

  return {
    body: await decision.response.text(),
    headers: decision.response.headers,
    status: decision.response.status,
  };
}

describe("Accept parsing", () => {
  test("parses q-values, specificity, and client order", () => {
    expect(parseAccept("text/markdown, text/html;q=0.8, */*;q=0.1")).toEqual([
      { position: 0, q: 1, specificity: 2, type: "text/markdown" },
      { position: 1, q: 0.8, specificity: 2, type: "text/html" },
      { position: 2, q: 0.1, specificity: 0, type: "*/*" },
    ]);
  });

  test("prefers markdown when it appears first at equal quality", () => {
    expect(preferredProducedType("text/markdown, text/html")).toBe("text/markdown");
    expect(preferredProducedType("text/html, text/markdown")).toBe("text/html");
  });

  test("honors q-values and explicit rejection", () => {
    expect(preferredProducedType("text/html;q=0.1, text/markdown;q=0.9")).toBe(
      "text/markdown",
    );
    expect(preferredProducedType("text/html;q=0, */*;q=1")).toBe("text/markdown");
    expect(preferredProducedType("text/markdown;q=0, text/html;q=0")).toBeNull();
    expect(preferredProducedType("application/pdf")).toBeNull();
  });

  test("defaults to HTML when Accept is missing or unconstrained", () => {
    expect(preferredProducedType(null)).toBe("text/html");
    expect(preferredProducedType("")).toBe("text/html");
    expect(preferredProducedType("*/*")).toBe("text/html");
  });
});

describe("agent discovery documents", () => {
  test("keeps homepage Markdown product-first with a compact research module", () => {
    const markdown = homepageMarkdown();
    const featured = getResearchArticle("noise-and-sleep-2026");

    if (featured === undefined) {
      throw new Error("Expected one featured research guide.");
    }

    expect(homepageDocumentText()).toContain(NOISE_HEADING);
    for (const paragraph of NOISE_DOCUMENT_PARAGRAPHS) {
      expect(homepageDocumentText()).toContain(paragraph);
      expect(markdown).toContain(paragraph);
    }
    expect(homepageDocumentText()).not.toContain(homepageAgentRequest);
    expect(homepageDocumentText()).not.toContain("There are no media files");
    expect(markdown).toContain("## What you can do");
    expect(markdown).toContain("## Featured research");
    expect(markdown).not.toContain("## Working model");
    expect(markdown).not.toContain("## Interfaces");
    expect(markdown).not.toContain("## Questions");
    expect(markdown).not.toContain("## Smallest useful action");
    expect(markdown).not.toContain(homepageAgentRequest);
    expect(markdown).not.toMatch(/\d+ linked sources/iu);
    expect(markdown).toContain(featured.evidenceLabel);
    expect(markdown).not.toContain("![");
    expect(markdown).toContain("## Sitemap");
    expect(markdown).toContain("/sitemap.md");
  });

  test("lists only indexable research guides in discovery documents", () => {
    const sitemap = sitemapMarkdown();
    const llms = llmsTxt();
    const researchIndex = researchIndexMarkdown();

    expect(llms).toContain("## When to use Sleepyland");
    expect(llms).toContain("## Interfaces");
    expect(llms).toContain(homepageAgentRequest);
    expect(llms).toContain("Do not use Sleepyland as a medical device");
    expect(llms).toContain("does not host an API");
    expect(llms).toContain("https://github.com/hraness/sleepyland");
    expect(llms).toContain("under the MIT License");
    expect(llms).not.toContain("openapi.json");
    expect(sitemap).toContain("## Sound machine");
    expect(sitemap).toContain("## Product records");
    expect(sitemap).toContain("## Research");

    for (const page of PRODUCT_PAGES) {
      const markdownUrl = `https://sleepy.land${page.path}.md`;
      expect(llms).toContain(markdownUrl);
      expect(sitemap).toContain(markdownUrl);
      expect(isKnownContentPath(page.path)).toBe(true);
      expect(productPageMarkdown(page)).toContain(
        `canonical_url: ${JSON.stringify(`https://sleepy.land${page.path}`)}`,
      );
    }

    expect(llms).not.toContain("## Reading");
    expect(sitemap).not.toContain("## Reading");
    expect(isKnownContentPath("/reading")).toBe(false);
    expect(markdownForPath("/reading")).toBeNull();

    for (const article of researchArticlesNewestFirst) {
      const markdownUrl = `https://sleepy.land${researchArticlePath(article.slug)}.md`;
      if (isIndexableResearchArticle(article)) {
        expect(llms).toContain(markdownUrl);
        expect(sitemap).toContain(markdownUrl);
        expect(researchIndex).toContain(markdownUrl);
      } else {
        expect(llms).not.toContain(markdownUrl);
        expect(sitemap).not.toContain(markdownUrl);
        expect(researchIndex).not.toContain(markdownUrl);
      }
      expect(isKnownContentPath(researchArticlePath(article.slug))).toBe(true);
    }

    expect(isKnownContentPath("/noise")).toBe(true);
    expect(sitemap).toContain("https://sleepy.land/noise.md");
  });

  test("renders a sourced article as markdown with frontmatter and recovery links", () => {
    const article = getResearchArticle("white-pink-brown-noise-for-sleep");

    if (article === undefined) {
      throw new Error("Expected the noise-color article to exist.");
    }

    const markdown = researchArticleMarkdown(article);

    expect(markdown).toContain(`title: ${JSON.stringify(article.title)}`);
    expect(markdown).toContain(`canonical_url: "https://sleepy.land${researchArticlePath(article.slug)}"`);
    expect(markdown).toContain(`# ${article.title}`);
    expect(markdown).toContain(article.dek);
    expect(markdown).toContain(
      "Drafted by an AI agent and checked against the linked sources by a separate Codex AI reviewer; no human clinical review is claimed.",
    );
    expect(markdown).toContain(
      `https://sleepy.land/editorial/research/${article.slug}.webp`,
    );
    expect(markdown).toContain("Sleepyland editorial illustration");
    expect(markdown).toContain("## Sources");
    expect(markdown).toContain("## Sitemap");
    expect(markdown).toContain("/sitemap.md");
    expect(markdown).toContain("/research.md");

    const imageLessArticle = getResearchArticle("why-car-rides-make-you-sleepy");
    if (imageLessArticle === undefined) throw new Error("Expected image-free guide.");
    const imageLessMarkdown = researchArticleMarkdown(imageLessArticle);
    expect(imageLessMarkdown).not.toContain("/editorial/research/");
    expect(imageLessMarkdown).toContain(`# ${imageLessArticle.title}`);
  });

  test("keeps 404 recovery copy pointed at discovery files", () => {
    const body = notFoundMarkdown();

    expect(body).toContain("# Page not found");
    expect(body).toContain("/llms.txt");
    expect(body).toContain("/sitemap.md");
    expect(body).toContain("/research.md");
    expect(body).toContain("/noise.md");
  });
});

describe("markdown negotiation", () => {
  test("serves markdown from the canonical URL and the .md sibling", async () => {
    const negotiatedHome = await negotiated("/", {
      accept: "text/markdown",
    });
    const sibling = await negotiated("/index.md");
    const articlePath = researchArticlePath(researchArticles[0]!.slug);
    const articleMarkdown = markdownForPath(articlePath);
    const article = await negotiated(articlePath, {
      accept: "text/markdown",
    });

    if (articleMarkdown === null) {
      throw new Error(`Expected markdown for ${articlePath}`);
    }

    expect(negotiatedHome.status).toBe(200);
    expect(negotiatedHome.headers.get("content-type")).toBe(MARKDOWN_CONTENT_TYPE);
    expect(negotiatedHome.headers.get("vary")).toBe("Accept");
    expect(negotiatedHome.headers.get("link")).toBe("<https://sleepy.land/>; rel=\"canonical\"");
    expect(negotiatedHome.body).toBe(homepageMarkdown());
    expect(sibling.body).toBe(homepageMarkdown());
    expect(article.body).toBe(articleMarkdown);
    expect(markdownAlternatePath("/")).toBe("/index.md");
    expect(markdownAlternatePath("/noise")).toBe("/noise.md");
    const noise = await negotiated("/noise", { accept: "text/markdown" });
    const noiseSibling = await negotiated("/noise.md");
    expect(noise.body).toBe(noiseMarkdown());
    expect(noiseSibling.body).toBe(noise.body);
    expect(noise.headers.get("link")).toBe(
      "<https://sleepy.land/noise>; rel=\"canonical\"",
    );
    const research = await negotiated("/research.md");
    expect(research.headers.get("link")).toBe(
      "<https://sleepy.land/research>; rel=\"canonical\"",
    );
    expect(research.body).toBe(researchIndexMarkdown());
    const privacy = await negotiated("/privacy", { accept: "text/markdown" });
    const privacySibling = await negotiated("/privacy.md");
    const privacyPage = PRODUCT_PAGES.find((page) => page.slug === "privacy");
    if (privacyPage === undefined) throw new Error("Expected privacy page.");
    expect(privacy.body).toBe(productPageMarkdown(privacyPage));
    expect(privacySibling.body).toBe(privacy.body);
  });

  test("propagates health-review noindex to every Markdown representation", async () => {
    const quarantined = researchArticles.filter(
      (article) => !isIndexableResearchArticle(article),
    );

    expect(quarantined.map((article) => article.slug)).toEqual(
      [...CLINICAL_REVIEW_REQUIRED_RESEARCH_SLUGS],
    );

    for (const article of quarantined) {
      const path = researchArticlePath(article.slug);
      const [negotiatedCanonical, markdownSibling] = await Promise.all([
        negotiated(path, { accept: "text/markdown" }),
        negotiated(`${path}.md`),
      ]);

      expect(negotiatedCanonical.status).toBe(200);
      expect(markdownSibling.status).toBe(200);
      expect(negotiatedCanonical.headers.get("x-robots-tag")).toBe("noindex");
      expect(markdownSibling.headers.get("x-robots-tag")).toBe("noindex");
    }

    const indexable = researchArticles.find(isIndexableResearchArticle);
    if (indexable === undefined) {
      throw new Error("Expected at least one indexable research guide.");
    }
    const indexableMarkdown = await negotiated(
      `${researchArticlePath(indexable.slug)}.md`,
    );
    expect(indexableMarkdown.headers.get("x-robots-tag")).toBeNull();
  });

  test("returns a markdown 404 with recovery links for unknown paths", async () => {
    const missing = await negotiated("/this-path-does-not-exist-agentic", {
      accept: "text/markdown",
    });
    const missingSibling = await negotiated("/missing.md");

    expect(missing.status).toBe(404);
    expect(missing.headers.get("content-type")).toBe(MARKDOWN_CONTENT_TYPE);
    expect(missing.body).toBe(notFoundMarkdown());
    expect(missingSibling.status).toBe(404);
    expect(missingSibling.body).toContain("/llms.txt");

    for (const retiredPath of [
      "/reading.md",
      "/reading/good-ideas.md",
      "/research/blue-light-scatter-and-visual-detail.md",
    ]) {
      const retired = await negotiated(retiredPath);
      expect(retired.status).toBe(404);
      expect(retired.body).toBe(notFoundMarkdown());
    }
  });

  test("returns 406 when every produced type is rejected", async () => {
    const response = await negotiated("/", {
      accept: "application/pdf",
    });

    expect(response.status).toBe(406);
    expect(response.headers.get("content-type")).toBe(PLAIN_TEXT_CONTENT_TYPE);
    expect(response.headers.get("vary")).toBe("Accept");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.body).toContain("text/html");
    expect(response.body).toContain("text/markdown");
  });

  test("leaves HTML, RSC, and discovery files to the App Router", () => {
    expect(negotiateAgentAccess(request("/")).kind).toBe("continue");
    expect(negotiateAgentAccess(request("/", {
      accept: "text/html",
    })).kind).toBe("continue");
    expect(negotiateAgentAccess(request("/", {
      accept: "text/markdown",
      rsc: "1",
    })).kind).toBe("continue");
    expect(negotiateAgentAccess(request("/llms.txt", {
      accept: "text/markdown",
    })).kind).toBe("continue");
    expect(negotiateAgentAccess(request("/sitemap.xml")).kind).toBe("continue");
    expect(negotiateAgentAccess(request("/sleepyland-mode-tune-play.mp4", {
      accept: "video/mp4",
    })).kind).toBe("continue");
    expect(negotiateAgentAccess(request("/", {}, "POST")).kind).toBe("continue");
  });

  test("appends Accept to an existing Vary list once", () => {
    const headers = new Headers({ Vary: "rsc, next-router-state-tree" });
    appendVaryAccept(headers);
    appendVaryAccept(headers);
    expect(headers.get("Vary")).toBe("rsc, next-router-state-tree, Accept");
  });
});

describe("discovery route handlers", () => {
  test("serves llms.txt as plain text with when-to-use guidance", async () => {
    const response = getLlmsTxt();
    const body = await response.text();

    expect(response.headers.get("content-type")).toBe(PLAIN_TEXT_CONTENT_TYPE);
    expect(body).toBe(llmsTxt());
    expect(body).toContain("## When to use Sleepyland");
  });

  test("serves sitemap.md as markdown with headings and article links", async () => {
    const response = getSitemapMarkdown();
    const body = await response.text();

    expect(response.headers.get("content-type")).toBe(MARKDOWN_CONTENT_TYPE);
    expect(response.headers.get("vary")).toBe("Accept");
    expect(body).toBe(sitemapMarkdown());
    expect(body.startsWith("# Sitemap")).toBe(true);
  });

  test("names the AI crawlers robots should allow", () => {
    expect(AI_CRAWLER_USER_AGENTS).toEqual([
      "GPTBot",
      "ClaudeBot",
      "CCBot",
      "Google-Extended",
    ]);
  });
});
