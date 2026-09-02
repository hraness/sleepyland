import { applicationFeatures, absoluteUrl } from "./seo";
import { researchEditorialImage } from "./editorial-images";
import { homepageAgentRequest } from "./homepage-content";
import { RESEARCH_AUTHORSHIP_DISCLOSURE } from "./research/editorial-disclosure";
import { RESEARCH_FEED_PATH } from "./search-discovery";
import {
  RESEARCH_SOURCES,
  discoverableResearchArticles,
  getResearchArticle,
  homepageResearchArticles,
  isIndexableResearchArticle,
  relatedResearchArticles,
  researchArticlePath,
  researchArticlesNewestFirst,
  researchTagLabel,
  type InlineContent,
  type InlinePart,
  type ResearchArticle,
  type ResearchBlock,
} from "./research/articles";
import { researchDescription } from "./research/seo";
import {
  PRODUCT_PAGES,
  isProductPagePath,
  type ProductPageDefinition,
  type ProductPageInline,
  type ProductPageSection,
} from "./product-pages";
import {
  noiseDescription,
  homepageUpdatedAt,
  repositoryUrl,
  researchContributionUrl,
  site,
} from "./site";

export const MARKDOWN_CONTENT_TYPE = "text/markdown; charset=utf-8";
export const PLAIN_TEXT_CONTENT_TYPE = "text/plain; charset=utf-8";
export const PRODUCED_MEDIA_TYPES = ["text/html", "text/markdown"] as const;

export const NOISE_HEADING = "Sleepyland sound machine";
export const NOISE_DOCUMENT_PARAGRAPHS = [
  noiseDescription,
  "Sleepyland is a free browser sound machine. It synthesizes brown, pink, or white noise, procedural ocean waves, and an airplane-like rumble in the page. The sound generator uses no recorded or hosted audio files, product accounts, or server-side audio. Settings are stored on this device; categorical sound mode and session kind can also appear in bounded anonymous production analytics.",
  "Choose Sleep, Relax, or Focus. Each state is a distinct engine recipe with its own rhythm, spectrum, and movement. Energy scales movement depth and pace without changing volume. Tune reveals noise color, shared warmth, independent noise and wave levels, and wave pace. Session plans are Endless, Countdown, and Focus Interval.",
] as const;

export const AI_CRAWLER_USER_AGENTS = [
  "GPTBot",
  "ClaudeBot",
  "CCBot",
  "Google-Extended",
] as const;

const FRAMEWORK_NAVIGATION_HEADERS = [
  "rsc",
  "next-router-state-tree",
  "next-router-prefetch",
  "next-router-segment-prefetch",
] as const;

export type ProducedMediaType = (typeof PRODUCED_MEDIA_TYPES)[number];

export interface AcceptEntry {
  readonly position: number;
  readonly q: number;
  readonly specificity: number;
  readonly type: string;
}

export type NegotiationDecision =
  | {
      readonly kind: "respond";
      readonly response: Response;
    }
  | {
      readonly kind: "continue";
    };

export function homepageDocumentText(): string {
  return [
    NOISE_HEADING,
    ...NOISE_DOCUMENT_PARAGRAPHS,
    "Featured research",
    RESEARCH_AUTHORSHIP_DISCLOSURE,
    ...homepageResearchArticles().slice(0, 3).map((article) => article.title),
  ].join("\n");
}

export function markdownAlternatePath(canonicalPath: string): string {
  return canonicalPath === "/" ? "/index.md" : `${canonicalPath}.md`;
}

export function parseAccept(header: string): readonly AcceptEntry[] {
  return header.split(",").flatMap((raw, position) => {
    const parts = raw.trim().split(";").map((part) => part.trim());
    const type = parts[0]?.toLowerCase();

    if (type === undefined || type === "") {
      return [];
    }

    let q = 1;

    for (const parameter of parts.slice(1)) {
      const [name, value] = parameter.split("=").map((part) => part.trim());

      if (name === "q") {
        const parsed = Number(value);

        if (!Number.isNaN(parsed)) {
          q = Math.max(0, Math.min(1, parsed));
        }
      }
    }

    return [{
      position,
      q,
      specificity: type === "*/*" ? 0 : type.endsWith("/*") ? 1 : 2,
      type,
    }];
  });
}

function acceptMatches(entry: AcceptEntry, candidate: string): boolean {
  if (entry.type === "*/*") {
    return true;
  }

  if (entry.type.endsWith("/*")) {
    return candidate.startsWith(entry.type.slice(0, -1));
  }

  return entry.type === candidate;
}

export function preferredProducedType(header: string | null): ProducedMediaType | null {
  if (header === null || header.trim() === "") {
    return "text/html";
  }

  const entries = parseAccept(header);

  if (entries.length === 0) {
    return "text/html";
  }

  let bestType: ProducedMediaType | null = null;
  let bestQ = -1;
  let bestPosition = Number.POSITIVE_INFINITY;

  for (const candidate of PRODUCED_MEDIA_TYPES) {
    let matched: AcceptEntry | null = null;

    for (const entry of entries) {
      if (!acceptMatches(entry, candidate)) {
        continue;
      }

      if (
        matched === null
        || entry.specificity > matched.specificity
        || (entry.specificity === matched.specificity && entry.position < matched.position)
      ) {
        matched = entry;
      }
    }

    if (matched === null || matched.q <= 0) {
      continue;
    }

    if (matched.q > bestQ || (matched.q === bestQ && matched.position < bestPosition)) {
      bestQ = matched.q;
      bestPosition = matched.position;
      bestType = candidate;
    }
  }

  return bestType;
}

export function appendVaryAccept(headers: Headers): void {
  const existing = headers.get("Vary");

  if (existing === null || existing.trim() === "") {
    headers.set("Vary", "Accept");
    return;
  }

  const tokens = existing.split(",").map((token) => token.trim().toLowerCase());

  if (!tokens.includes("accept")) {
    headers.set("Vary", `${existing}, Accept`);
  }
}

export function isFrameworkNavigation(request: Request): boolean {
  return FRAMEWORK_NAVIGATION_HEADERS.some((name) => request.headers.get(name) !== null);
}

function normalizePathname(pathname: string): string {
  if (pathname === "/") {
    return "/";
  }

  let decoded = pathname;

  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    decoded = pathname;
  }

  return decoded.endsWith("/") ? decoded.slice(0, -1) : decoded;
}

function stripMarkdownExtension(pathname: string): {
  readonly explicitMarkdown: boolean;
  readonly path: string;
} {
  if (pathname === "/index.md") {
    return { explicitMarkdown: true, path: "/" };
  }

  if (pathname.endsWith(".md")) {
    const withoutExtension = pathname.slice(0, -3);
    return {
      explicitMarkdown: true,
      path: withoutExtension === "" ? "/" : withoutExtension,
    };
  }

  return { explicitMarkdown: false, path: pathname };
}

export function isPassthroughPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next/")
    || pathname.startsWith("/_vercel/")
    || pathname === "/robots.txt"
    || pathname === "/sitemap.xml"
    || pathname === "/llms.txt"
    || pathname === "/sitemap.md"
    || pathname === RESEARCH_FEED_PATH
    || pathname === "/icon"
    || pathname === "/icon.png"
    || pathname === "/apple-icon"
    || pathname === "/apple-icon.png"
    || pathname.endsWith("/opengraph-image")
    || pathname.endsWith(".txt")
    || /\.(?:css|gif|ico|jpe?g|js|map|mp4|png|svg|webp|woff2?)$/iu.test(pathname)
  );
}

export function isKnownContentPath(pathname: string): boolean {
  if (
    pathname === "/"
    || pathname === "/noise"
    || pathname === "/research"
    || pathname === "/design"
    || isProductPagePath(pathname)
  ) {
    return true;
  }

  if (!pathname.startsWith("/research/")) {
    return false;
  }

  return getResearchArticle(pathname.slice("/research/".length)) !== undefined;
}

function renderProductPageInline(content: readonly ProductPageInline[]): string {
  return content.map((part) =>
    typeof part === "string" ? part : `[${part.text}](${part.href})`).join("");
}

export type DocumentPageMarkdownSource = Readonly<{
  description: string;
  heading: string;
  intro: readonly ProductPageInline[];
  path: `/${string}`;
  sections: readonly ProductPageSection[];
  updatedAt: string;
}>;

export function productPageMarkdown(
  page: ProductPageDefinition | DocumentPageMarkdownSource,
): string {
  return withFrontmatter({
    canonicalPath: page.path,
    description: page.description,
    lastUpdated: page.updatedAt,
    title: page.heading,
  }, [
    `# ${page.heading}`,
    "",
    renderProductPageInline(page.intro),
    "",
    ...page.sections.flatMap((section) => [
      `## ${section.heading}`,
      "",
      ...(section.items ?? []).flatMap((item) => [
        `- ${renderProductPageInline(item)}`,
      ]),
      ...(section.items === undefined ? [] : [""]),
      ...(section.paragraphs ?? []).flatMap((paragraph) => [
        renderProductPageInline(paragraph),
        "",
      ]),
    ]),
  ].join("\n"));
}

function renderInlinePart(part: InlinePart): string {
  if (typeof part === "string") {
    return part;
  }

  let text = part.text;

  if (part.emphasis === "strong") {
    text = `**${text}**`;
  } else if (part.emphasis === "em") {
    text = `*${text}*`;
  }

  return part.href === undefined ? text : `[${text}](${part.href})`;
}

function renderInline(content: InlineContent): string {
  return content.map(renderInlinePart).join("");
}

function renderBlock(block: ResearchBlock): string {
  if (block.type === "editorial-image") {
    const image = researchEditorialImage(block.imageSlug);
    if (image === undefined) return "";
    return `![${image.alt}](${absoluteUrl(image.src)})\n\n*${image.caption} ${image.credit}.*`;
  }

  if (block.type === "heading") {
    return `${"#".repeat(block.level)} ${block.text}`;
  }

  if (block.type === "paragraph") {
    return renderInline(block.content);
  }

  if (block.type === "callout") {
    return `> **${block.label}**\n>\n> ${renderInline(block.content)}`;
  }

  if (block.type === "list") {
    return block.items.map((entry, index) => {
      const marker = block.style === "ordered" ? `${index + 1}.` : "-";
      return `${marker} ${renderInline(entry)}`;
    }).join("\n");
  }

  const header = `| ${block.columns.join(" | ")} |`;
  const divider = `| ${block.columns.map(() => "---").join(" | ")} |`;
  const rows = block.rows.map((row) =>
    `| ${row.map((cell) => renderInline(cell)).join(" | ")} |`);

  return [`*${block.caption}*`, "", header, divider, ...rows].join("\n");
}

function sitemapSection(): string {
  return [
    "## Sitemap",
    "",
    "See the full [sitemap](/sitemap.md) for every public page.",
  ].join("\n");
}

function withFrontmatter(
  fields: Readonly<{
    canonicalPath: string;
    description: string;
    lastUpdated: string;
    title: string;
  }>,
  body: string,
): string {
  return [
    "---",
    `title: ${JSON.stringify(fields.title)}`,
    `description: ${JSON.stringify(fields.description)}`,
    `canonical_url: ${JSON.stringify(absoluteUrl(fields.canonicalPath))}`,
    `last_updated: ${JSON.stringify(fields.lastUpdated)}`,
    "---",
    "",
    body.trim(),
    "",
    sitemapSection(),
    "",
  ].join("\n");
}

export function homepageMarkdown(
  candidateArticles: readonly ResearchArticle[] = homepageResearchArticles(),
): string {
  const homepageArticles = discoverableResearchArticles(candidateArticles).slice(0, 3);

  return withFrontmatter({
    canonicalPath: "/",
    description: noiseDescription,
    lastUpdated: homepageUpdatedAt,
    title: NOISE_HEADING,
  }, [
    `# ${NOISE_HEADING}`,
    "",
    ...NOISE_DOCUMENT_PARAGRAPHS.flatMap((paragraph) => [paragraph, ""]),
    "## What you can do",
    "",
    ...applicationFeatures.map((feature) => `- ${feature}`),
    "",
    "## Featured research",
    "",
    RESEARCH_AUTHORSHIP_DISCLOSURE,
    "",
    ...homepageArticles.flatMap((article) => [
      `- [${article.title}](${absoluteUrl(`${researchArticlePath(article.slug)}.md`)}): ${article.evidenceLabel}.`,
    ]),
    "",
    `- [Browse every admitted guide](${absoluteUrl("/research.md")})`,
  ].join("\n"));
}

export function researchIndexMarkdown(
  candidateArticles: readonly ResearchArticle[] = researchArticlesNewestFirst,
): string {
  return withFrontmatter({
    canonicalPath: "/research",
    description: researchDescription,
    lastUpdated: homepageUpdatedAt,
    title: "All Sleepyland research guides",
  }, [
    "# All Sleepyland research guides",
    "",
    researchDescription,
    "",
    RESEARCH_AUTHORSHIP_DISCLOSURE,
    "",
    ...discoverableResearchArticles(candidateArticles).map((article) =>
      `- [${article.title}](${absoluteUrl(`${researchArticlePath(article.slug)}.md`)}): ${article.evidenceLabel}.`),
  ].join("\n"));
}

export function noiseMarkdown(): string {
  return withFrontmatter({
    canonicalPath: "/noise",
    description: noiseDescription,
    lastUpdated: site.updatedAt,
    title: NOISE_HEADING,
  }, [
    `# ${NOISE_HEADING}`,
    "",
    ...NOISE_DOCUMENT_PARAGRAPHS.flatMap((paragraph) => [paragraph, ""]),
    "## What you can do",
    "",
    ...applicationFeatures.map((feature) => `- ${feature}`),
    "",
    `- [Read Sleepyland Research](${absoluteUrl("/research.md")})`,
    `- [View the source on GitHub](${repositoryUrl})`,
  ].join("\n"));
}

export function researchArticleMarkdown(article: ResearchArticle): string {
  const path = researchArticlePath(article.slug);
  const editorialImage = researchEditorialImage(article.slug);
  const sources = article.sourceIds.map((sourceId) => RESEARCH_SOURCES[sourceId]);
  const related = relatedResearchArticles(article);

  return withFrontmatter({
    canonicalPath: path,
    description: article.seoDescription,
    lastUpdated: article.updatedAt,
    title: article.title,
  }, [
    `# ${article.title}`,
    "",
    article.dek,
    "",
    ...(editorialImage === undefined ? [] : [
      `![${editorialImage.alt}](${absoluteUrl(editorialImage.src)})`,
      "",
      `*${editorialImage.caption} ${editorialImage.credit}.*`,
      "",
    ]),
    `By [Sleepyland Research](${absoluteUrl("/research.md")}). ${RESEARCH_AUTHORSHIP_DISCLOSURE} Published ${article.publishedAt}. Updated ${article.updatedAt}. ${article.evidenceLabel}. Tags: ${article.tags.map(researchTagLabel).join(", ")}.`,
    "",
    ...article.body.flatMap((block) => [renderBlock(block), ""]),
    "## Sources",
    "",
    ...sources.map((source, index) =>
      `${index + 1}. [${source.title}](${source.url}) — ${source.publication}, ${source.year}. ${source.note}`),
    "",
    "## Continue researching",
    "",
    ...related.map((relatedArticle) =>
      `- [${relatedArticle.title}](${absoluteUrl(`${researchArticlePath(relatedArticle.slug)}.md`)})`),
    "",
    `- [All research](${absoluteUrl("/research.md")})`,
    `- [Open the sound machine](${absoluteUrl("/noise.md")})`,
    `- [Contribute a correction or source](${researchContributionUrl})`,
    "",
    "Educational evidence synthesis, not medical advice. We distinguish direct findings from mechanism and inference and revise material claims when stronger evidence appears.",
  ].join("\n"));
}

export function designMarkdown(): string {
  return withFrontmatter({
    canonicalPath: "/design",
    description:
      "Sleepyland's living browser design-system specification and responsive component stress lab.",
    lastUpdated: site.updatedAt,
    title: "Sleepyland design",
  }, [
    "# Sleepyland design",
    "",
    "This page is the product-owned interface specification for Sleepyland. It is a design-system gallery, not a listener destination.",
    "",
    "## Night palette",
    "",
    "Black, warm amber, compact controls, and one bright transport action.",
    "",
    "## Sound controls",
    "",
    "Three clear sound states with detailed tuning available only on demand.",
    "",
    `- [Open the sound machine](${absoluteUrl("/noise.md")})`,
    `- [Sleepyland Research](${absoluteUrl("/research.md")})`,
  ].join("\n"));
}

export function notFoundMarkdown(): string {
  return [
    "# Page not found",
    "",
    "This path is not a Sleepyland page. The address may be out of date, or the page may have moved.",
    "",
    "## Where to look next",
    "",
    `- [Sleepyland Research](${absoluteUrl("/research.md")})`,
    `- [Sleepyland sound machine](${absoluteUrl("/noise.md")})`,
    `- [llms.txt](${absoluteUrl("/llms.txt")})`,
    `- [Markdown sitemap](${absoluteUrl("/sitemap.md")})`,
    `- [XML sitemap](${absoluteUrl("/sitemap.xml")})`,
    "",
  ].join("\n");
}

export function llmsTxt(
  candidateArticles: readonly ResearchArticle[] = researchArticlesNewestFirst,
): string {
  return [
    "# Sleepyland",
    "",
    `> ${site.description}`,
    "",
    "Sleepyland publishes sourced sleep research and provides a free sleep, relaxation, and focus sound generator in the browser. It does not host an API, OAuth flow, GraphQL endpoint, MCP server, developer portal, or store.",
    `Its source and contribution guidance are public at ${repositoryUrl} under the MIT License.`,
    "",
    "## When to use Sleepyland",
    "",
    "Use Sleepyland when a person wants a free, account-free sound machine in the browser for sleep, relaxation, or focus, and can start playback themselves. Point them at the sound machine, name Sleep, Relax, or Focus, and mention Tune only if they ask about noise color, warmth, levels, or wave pace.",
    "",
    "Use Sleepyland Research when a person wants sourced evidence about insomnia, behavior, sound, sleep duration, circadian light, unfamiliar rooms, ancestral-sleep claims, masking, or related wellness claims. Quote the visible guide, keep direct findings separate from mechanism, inference, and crowdsourced experience, and do not present the publication as medical advice or a guaranteed outcome.",
    "",
    "Do not use Sleepyland as a medical device, sleep-treatment service, account-based app, audio API, or uploaded-track library. Do not send tuning values, exact playback duration, or spectrum gestures to analytics. Do not invent developer resources that this site does not publish.",
    "",
    "## Interfaces",
    "",
    "Human readers use the canonical HTML pages. Agents can request the same canonical page with Accept: text/markdown or fetch its .md sibling. Preserve the guide title, evidence label, sources, revision date, and limits when quoting or summarizing it.",
    "",
    "```sh",
    homepageAgentRequest,
    "```",
    "",
    "## Sound machine",
    "",
    `- [Sleepyland sound machine](${absoluteUrl("/noise.md")}): Mix brown, pink, or white noise with procedural ocean waves and airplane-like rumble. Settings stay on the device.`,
    "",
    "## Product records",
    "",
    ...PRODUCT_PAGES.map((page) =>
      `- [${page.heading}](${absoluteUrl(`${page.path}.md`)}): ${page.description}`),
    "",
    "## Research",
    "",
    `- [Sleepyland Research](${absoluteUrl("/research.md")}): Evidence-led guides and the editorial method.`,
    ...discoverableResearchArticles(candidateArticles).map((article) =>
      `- [${article.title}](${absoluteUrl(`${researchArticlePath(article.slug)}.md`)}): ${article.dek}`),
    "",
    "## Discovery files",
    "",
    `- [Markdown sitemap](${absoluteUrl("/sitemap.md")})`,
    `- [XML sitemap](${absoluteUrl("/sitemap.xml")})`,
    `- [Research RSS feed](${absoluteUrl(RESEARCH_FEED_PATH)})`,
    `- [robots.txt](${absoluteUrl("/robots.txt")})`,
    `- [GitHub source and contribution guide](${repositoryUrl})`,
    "",
  ].join("\n");
}

export function sitemapMarkdown(
  candidateArticles: readonly ResearchArticle[] = researchArticlesNewestFirst,
): string {
  return [
    "# Sitemap",
    "",
    "Sleepyland public pages for people and agents. Request `Accept: text/markdown` on the HTML URL, or fetch the `.md` sibling.",
    "",
    "## Research",
    "",
    `- [Sleepyland Research](${absoluteUrl("/research.md")})`,
    ...discoverableResearchArticles(candidateArticles).map((article) =>
      `- [${article.title}](${absoluteUrl(`${researchArticlePath(article.slug)}.md`)})`),
    "",
    "## Sound machine",
    "",
    `- [Sleepyland sound machine](${absoluteUrl("/noise.md")})`,
    "",
    "## Product records",
    "",
    ...PRODUCT_PAGES.map((page) =>
      `- [${page.heading}](${absoluteUrl(`${page.path}.md`)})`),
    "",
    "## Discovery files",
    "",
    `- [llms.txt](${absoluteUrl("/llms.txt")})`,
    `- [XML sitemap](${absoluteUrl("/sitemap.xml")})`,
    `- [Research RSS feed](${absoluteUrl(RESEARCH_FEED_PATH)})`,
    `- [GitHub source and contribution guide](${repositoryUrl})`,
    "",
  ].join("\n");
}

export function markdownForPath(pathname: string): string | null {
  if (pathname === "/") {
    return homepageMarkdown();
  }

  if (pathname === "/research") {
    return researchIndexMarkdown();
  }

  if (pathname === "/noise") {
    return noiseMarkdown();
  }

  if (pathname === "/design") {
    return designMarkdown();
  }

  const productPage = PRODUCT_PAGES.find((page) => page.path === pathname);
  if (productPage !== undefined) {
    return productPageMarkdown(productPage);
  }

  if (pathname.startsWith("/research/")) {
    const article = getResearchArticle(pathname.slice("/research/".length));
    return article === undefined ? null : researchArticleMarkdown(article);
  }

  return null;
}

function markdownHeaders(
  canonicalPath: string,
  articleOverride?: ResearchArticle,
): Headers {
  const headers = new Headers({
    "Cache-Control": "public, max-age=0, must-revalidate",
    "Content-Type": MARKDOWN_CONTENT_TYPE,
    "Link": `<${absoluteUrl(canonicalPath)}>; rel="canonical"`,
    "Vary": "Accept",
  });

  if (canonicalPath.startsWith("/research/")) {
    const article = articleOverride ?? getResearchArticle(
      canonicalPath.slice("/research/".length),
    );
    if (article !== undefined && !isIndexableResearchArticle(article)) {
      headers.set("X-Robots-Tag", "noindex");
    }
  }

  return headers;
}

export function markdownResponse(
  canonicalPath: string,
  body: string,
  article?: ResearchArticle,
): Response {
  return new Response(body, {
    headers: markdownHeaders(canonicalPath, article),
    status: 200,
  });
}

function canonicalMarkdownPath(path: string): string {
  return path;
}

export function notFoundMarkdownResponse(): Response {
  return new Response(notFoundMarkdown(), {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Content-Type": MARKDOWN_CONTENT_TYPE,
      "Vary": "Accept",
    },
    status: 404,
  });
}

export function notAcceptableResponse(): Response {
  return new Response(
    "Not Acceptable\n\nAvailable: text/html, text/markdown\n",
    {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": PLAIN_TEXT_CONTENT_TYPE,
        "Vary": "Accept",
      },
      status: 406,
    },
  );
}

export function negotiateAgentAccess(request: Request): NegotiationDecision {
  const url = new URL(request.url);
  const pathname = normalizePathname(url.pathname);

  if (request.method !== "GET" && request.method !== "HEAD") {
    return { kind: "continue" };
  }

  if (isPassthroughPath(pathname) || isFrameworkNavigation(request)) {
    return { kind: "continue" };
  }

  const { explicitMarkdown, path } = stripMarkdownExtension(pathname);
  const acceptHeader = request.headers.get("accept");
  const chosen = preferredProducedType(acceptHeader);

  if (explicitMarkdown) {
    const body = markdownForPath(path);
    return {
      kind: "respond",
      response: body === null
        ? notFoundMarkdownResponse()
        : markdownResponse(canonicalMarkdownPath(path), body),
    };
  }

  if (chosen === "text/markdown") {
    const body = markdownForPath(path);
    return {
      kind: "respond",
      response: body === null
        ? notFoundMarkdownResponse()
        : markdownResponse(canonicalMarkdownPath(path), body),
    };
  }

  if (chosen === null && acceptHeader !== null && acceptHeader.trim() !== "") {
    return { kind: "respond", response: notAcceptableResponse() };
  }

  return { kind: "continue" };
}
