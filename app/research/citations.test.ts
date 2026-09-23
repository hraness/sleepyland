import { describe, expect, test } from "bun:test";

import { RESEARCH_SOURCES } from "./articles";
import citationRecords from "./citation-records.json";
import {
  citationIdentifier,
  citationKey,
  citationMismatches,
  type CitationRecords,
} from "./citations";

const records: CitationRecords = citationRecords;

const checkedSources = Object.entries(RESEARCH_SOURCES).flatMap(([sourceId, source]) => {
  const identifier = citationIdentifier(source.url);
  return identifier === null ? [] : [{ key: citationKey(identifier), source, sourceId }];
});

describe("research citation records", () => {
  test("parses PubMed, PMC, and DOI links", () => {
    expect(citationIdentifier("https://pubmed.ncbi.nlm.nih.gov/16793001/")).toEqual({ id: "16793001", kind: "pmid" });
    expect(citationIdentifier("https://pmc.ncbi.nlm.nih.gov/articles/PMC12324345/")).toEqual({ id: "PMC12324345", kind: "pmcid" });
    expect(citationIdentifier("https://doi.org/10.1093/sleep/zsag001")).toEqual({ id: "10.1093/sleep/zsag001", kind: "doi" });
    expect(citationIdentifier("https://journals.sagepub.com/doi/10.1177/0748730415590702")).toEqual({ id: "10.1177/0748730415590702", kind: "doi" });
    expect(citationIdentifier("https://www.who.int/tools/compendium-on-health-and-environment/environmental-noise")).toBeNull();
  });

  test("covers every PubMed, PMC, and DOI source with a resolved snapshot record", () => {
    expect(checkedSources.length).toBeGreaterThan(90);
    for (const { key, sourceId } of checkedSources) {
      expect({ sourceId, recorded: records[key] !== undefined }).toEqual({ sourceId, recorded: true });
    }
    const registryKeys = new Set(checkedSources.map(({ key }) => key));
    expect(Object.keys(records).filter((key) => !registryKeys.has(key))).toEqual([]);
  });

  test("names the title, journal, and year of the paper each source links to", () => {
    const failures = checkedSources.flatMap(({ key, source, sourceId }) => {
      const record = records[key];
      return record === undefined
        ? []
        : citationMismatches(source, record).map((mismatch) => ({ sourceId, ...mismatch }));
    });
    expect(failures).toEqual([]);
  });

  test("rejects metadata written for a different paper than the link", () => {
    const record = records["pmid:16793001"];
    expect(record).toBeDefined();
    if (record === undefined) return;

    expect(citationMismatches({
      title: "The effect of clock monitoring on insomnia",
      publication: "Behaviour Research and Therapy",
      year: 2005,
    }, record).map((mismatch) => mismatch.field)).toEqual(["title", "publication", "year"]);
  });

  test("requires a preprint to be labeled as one", () => {
    const record = records["pmcid:PMC12324345"];
    expect(record?.preprint).toBeTrue();
    if (record === undefined) return;

    const source = RESEARCH_SOURCES.tobaLongitudinal2025;
    expect(citationMismatches(source, record)).toEqual([]);
    expect(citationMismatches({ ...source, publication: "SLEEP Advances" }, record)
      .map((mismatch) => mismatch.field)).toEqual(["publication"]);
    expect(citationMismatches({ ...source, publication: "bioRxiv" }, record)
      .map((mismatch) => mismatch.field)).toEqual(["publication"]);
  });
});
