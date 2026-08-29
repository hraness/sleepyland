import { describe, expect, test } from "bun:test";
import { INDEXABLE_ROBOTS } from "@hraness/web-discovery";
import { renderToStaticMarkup } from "react-dom/server";

import ReadingNotePage, {
  generateMetadata,
  generateStaticParams,
} from "./(product-info)/reading/[slug]/page";
import ReadingIndexPage, {
  metadata as readingIndexMetadata,
} from "./(product-info)/reading/page";
import { readingEditorialImage } from "./editorial-images";
import { PRODUCT_PAGES } from "./product-pages";
import { READING_NOTES } from "./reading-notes";

describe("Sleepyland reading notes", () => {
  test("statically publishes canonical, indexable reading routes with markdown alternates", async () => {
    expect(generateStaticParams()).toEqual(
      READING_NOTES.map((note) => ({ slug: note.slug })),
    );

    for (const note of READING_NOTES) {
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: note.slug }),
      });
      const markup = renderToStaticMarkup(await ReadingNotePage({
        params: Promise.resolve({ slug: note.slug }),
      }));
      const editorialImage = readingEditorialImage(note.slug);

      expect(metadata).toMatchObject({
        title: note.title,
        description: note.description,
        robots: INDEXABLE_ROBOTS,
        alternates: {
          canonical: note.path,
          types: { "text/markdown": `${note.path}.md` },
        },
        openGraph: {
          images: [{
            alt: editorialImage.alt,
            height: editorialImage.height,
            url: editorialImage.src,
            width: editorialImage.width,
          }],
        },
      });
      expect(markup).toContain(`<h1>${note.heading}</h1>`);
      expect(markup.match(/<h1>/gu)).toEqual(["<h1>"]);
      expect(markup).toContain(`dateTime="${note.publishedAt}"`);
      expect(markup).toContain(`dateTime="${note.updatedAt}"`);
      expect(markup).toContain(`alt="${editorialImage.alt}"`);
      expect(markup).toContain(editorialImage.caption);
      expect(markup).toContain(editorialImage.credit);
      expect(markup).toContain('id="reading-note-structured-data"');
      expect(markup).toContain('"@type":"BlogPosting"');
      expect(markup).toContain(`https://sleepy.land${editorialImage.src}`);
    }
  });

  test("publishes a crawlable reading index with every illustrated note", () => {
    const markup = renderToStaticMarkup(<ReadingIndexPage />);

    expect(readingIndexMetadata.alternates).toEqual({
      canonical: "/reading",
      types: { "text/markdown": "/reading.md" },
    });
    expect(markup).toContain('id="reading-collection-structured-data"');
    for (const note of READING_NOTES) {
      expect(markup).toContain(`href="${note.path}"`);
      expect(markup).toContain(encodeURIComponent(readingEditorialImage(note.slug).src));
    }
  });

  test("keeps the good-ideas take distinct from About and free of medical advice", async () => {
    const note = READING_NOTES.find((entry) => entry.slug === "good-ideas");
    const about = PRODUCT_PAGES.find((page) => page.slug === "about");
    if (note === undefined) throw new Error("Expected good-ideas reading note.");
    if (about === undefined) throw new Error("Expected about page.");

    const markup = renderToStaticMarkup(await ReadingNotePage({
      params: Promise.resolve({ slug: note.slug }),
    }));

    expect(note.heading).not.toBe(about.heading);
    expect(note.path).toBe("/reading/good-ideas");
    expect(markup).toContain("<h1>Rest and attention as a condition for new ideas</h1>");
    expect(markup).not.toContain("<h1>What Sleepyland is</h1>");
    expect(markup).toContain('href="/about"');
    expect(markup).toContain('href="/noise"');
    expect(markup).toContain('href="https://hraness.com"');
    expect(markup).toContain('href="https://www.henrikkarlsson.xyz/p/good-ideas"');
    expect(markup).toContain(
      'href="https://hraness.com/reading/cultivating-a-state-of-mind-where-new-ideas-are-born"',
    );
    expect(markup).toContain("not a medical device");
    expect(markup).toContain("not medical advice");
    expect(markup).toContain("does not diagnose");
    expect(markup).toContain("does not recommend supplements or treatment");
    expect(markup).not.toMatch(/creatine/iu);
    expect(markup).toContain("not guaranteed outcomes");
    expect(markup).not.toMatch(/(?:cure|treat insomnia|clinically proven)/iu);
    expect(markup).toContain('href="/reading/habit-and-rest"');
  });

  test("keeps the habit-and-rest take distinct from About, good-ideas, and medical advice", async () => {
    const note = READING_NOTES.find((entry) => entry.slug === "habit-and-rest");
    const sibling = READING_NOTES.find((entry) => entry.slug === "good-ideas");
    const about = PRODUCT_PAGES.find((page) => page.slug === "about");
    if (note === undefined) throw new Error("Expected habit-and-rest reading note.");
    if (sibling === undefined) throw new Error("Expected good-ideas reading note.");
    if (about === undefined) throw new Error("Expected about page.");

    const markup = renderToStaticMarkup(await ReadingNotePage({
      params: Promise.resolve({ slug: note.slug }),
    }));

    expect(note.heading).not.toBe(about.heading);
    expect(note.heading).not.toBe(sibling.heading);
    expect(note.path).toBe("/reading/habit-and-rest");
    expect(markup).toContain(
      "<h1>Rest is not a habit until the first small hard thing starts</h1>",
    );
    expect(markup).not.toContain("<h1>What Sleepyland is</h1>");
    expect(markup).not.toContain("<h1>Rest and attention as a condition for new ideas</h1>");
    expect(markup).toContain('href="/reading/good-ideas"');
    expect(markup).toContain('href="/about"');
    expect(markup).toContain('href="/noise"');
    expect(markup).toContain(
      'href="https://hraness.com/reading/the-best-general-advice-on-earth"',
    );
    expect(markup).toContain(
      'href="https://hraness.com/reading/very-much-in-line-with-william-james"',
    );
    expect(markup).toContain('href="https://jsomers.net/blog/william-james-advice"');
    expect(markup).not.toContain("jsomers.net/blog/the-best-general-advice-on-earth");
    expect(markup).toContain(
      'href="https://x.com/shreyans___/status/2090209900076949677"',
    );
    expect(markup).toContain(
      'href="/research/sound-for-focus-noise-music-silence"',
    );
    expect(markup).toContain("not a medical device");
    expect(markup).toContain("not medical advice");
    expect(markup).toContain("does not diagnose");
    expect(markup).toContain("does not recommend supplements or treatment");
    expect(markup).toContain("not guaranteed outcomes");
    expect(markup).not.toMatch(/creatine/iu);
    expect(markup).not.toMatch(/(?:cure|treat insomnia|clinically proven)/iu);
    expect(markup).not.toMatch(/\bZo\b/u);
    expect(markup).not.toContain("stripedex.com");
    expect(markup).not.toContain("spongeresearch.com");
    expect(markup).toContain('href="/reading/anger-anxiety-agency"');
  });

  test("keeps the anger-anxiety-agency take distinct from About, siblings, and medical advice", async () => {
    const note = READING_NOTES.find((entry) => entry.slug === "anger-anxiety-agency");
    const habit = READING_NOTES.find((entry) => entry.slug === "habit-and-rest");
    const ideas = READING_NOTES.find((entry) => entry.slug === "good-ideas");
    const about = PRODUCT_PAGES.find((page) => page.slug === "about");
    if (note === undefined) throw new Error("Expected anger-anxiety-agency reading note.");
    if (habit === undefined) throw new Error("Expected habit-and-rest reading note.");
    if (ideas === undefined) throw new Error("Expected good-ideas reading note.");
    if (about === undefined) throw new Error("Expected about page.");

    const markup = renderToStaticMarkup(await ReadingNotePage({
      params: Promise.resolve({ slug: note.slug }),
    }));

    expect(note.heading).not.toBe(about.heading);
    expect(note.heading).not.toBe(habit.heading);
    expect(note.heading).not.toBe(ideas.heading);
    expect(note.path).toBe("/reading/anger-anxiety-agency");
    expect(markup).toContain(
      "<h1>Rest is where anxiety can become curiosity</h1>",
    );
    expect(markup).not.toContain("<h1>What Sleepyland is</h1>");
    expect(markup).not.toContain("<h1>Rest and attention as a condition for new ideas</h1>");
    expect(markup).not.toContain(
      "<h1>Rest is not a habit until the first small hard thing starts</h1>",
    );
    expect(markup).toContain("not that Reading digest");
    expect(markup).toContain('href="https://lucumr.pocoo.org/2026/8/24/anger-anxiety-agency/"');
    expect(markup).toContain(
      'href="https://hraness.com/reading/anger-anxiety-and-agency"',
    );
    expect(markup).toContain('href="/reading/habit-and-rest"');
    expect(markup).toContain('href="/reading/good-ideas"');
    expect(markup).toContain('href="/noise"');
    expect(markup).toContain('href="/about"');
    expect(markup).toContain(
      'href="/research/is-eight-hours-of-sleep-necessary"',
    );
    expect(markup).not.toContain("stripedex.com");
    expect(markup).not.toContain("spongeresearch.com");
    expect(markup).not.toContain("henrikkarlsson.xyz");
    expect(markup).toContain("not a medical device");
    expect(markup).toContain("not medical advice");
    expect(markup).toContain("does not diagnose");
    expect(markup).toContain("does not recommend supplements or treatment");
    expect(markup).toContain("not a cure");
    expect(markup).toContain("not guaranteed outcomes");
    expect(markup).not.toMatch(/creatine/iu);
    expect(markup).not.toMatch(/(?:treat insomnia|clinically proven)/iu);
  });
});
