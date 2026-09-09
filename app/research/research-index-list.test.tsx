import { expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ResearchIndexList } from "./research-index-list";

test("the research library keeps its accessible filter target and empty-list recovery", () => {
  const markup = renderToStaticMarkup(createElement(ResearchIndexList, {
    articles: [],
    tagOptions: [{ id: "sound", label: "Sound" }],
  }));
  expect(markup).toContain("Research library");
  expect(markup).toContain("0 articles");
  expect(markup).toContain("New guides will appear here.");
  expect(markup).toContain('id="research-articles"');
  expect(markup.match(/aria-controls="research-articles"/gu)).toHaveLength(2);
  expect(markup).toContain('aria-pressed="true"');
  expect(markup).toContain('aria-live="polite"');
});

test("topic changes include the selected topic and offer a reset for empty results", async () => {
  const source = await Bun.file(new URL("./research-index-list.tsx", import.meta.url)).text();
  expect(source).toContain('tagOptions.find((tag) => tag.id === selectedTag)?.label');
  expect(source).toContain('selectedTopic === undefined ? null : ` · ${selectedTopic}`');
  expect(source).toContain('No articles in this topic.');
  expect(source).toContain('onClick={() => setSelectedTag("all")} type="button">Show all articles');
});
