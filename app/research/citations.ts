import type { ResearchSource } from "./articles";

/**
 * Bibliographic checks for the research source registry. A source link that
 * resolves proves only that the link works; these helpers compare the title,
 * journal, and year in the registry with the record the link points to.
 *
 * `scripts/check-citations.ts` resolves PubMed, PMC, and DOI records over the
 * network and writes `citation-records.json`. The offline test compares the
 * registry with that snapshot so CI needs no network.
 */

export type CitationIdentifier = Readonly<{
  id: string;
  kind: "doi" | "pmcid" | "pmid";
}>;

export type CitationRecord = Readonly<{
  /** Journal or server names as the resolver reports them: full name first. */
  journals: readonly string[];
  preprint: boolean;
  title: string;
  /** Issue, print, and online publication years. Any of them may be cited. */
  years: readonly number[];
}>;

export type CitationRecords = Readonly<Record<string, CitationRecord>>;

export type CitationMismatch = Readonly<{
  expected: string;
  field: "publication" | "title" | "year";
  found: string;
}>;

/**
 * Equivalent journal names that normalization alone cannot match. Keys and
 * values are normalized names.
 */
const JOURNAL_ALIASES: Readonly<Record<string, readonly string[]>> = {
  "acta bio medica": ["acta biomedica"],
  "philosophical transactions of the royal society of london series b biological sciences": [
    "philosophical transactions of the royal society b biological sciences",
  ],
  "proceedings biological sciences": ["proceedings of the royal society b"],
  "proceedings of the national academy of sciences of the united states of america": [
    "proceedings of the national academy of sciences",
  ],
};

export function citationIdentifier(url: string): CitationIdentifier | null {
  const pubmed = /pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/u.exec(url);
  if (pubmed !== null) return { id: pubmed[1], kind: "pmid" };

  const pmc = /\/(PMC\d+)/iu.exec(url);
  if (pmc !== null) return { id: pmc[1].toUpperCase(), kind: "pmcid" };

  const doi = /(?:doi\.org\/|\/doi\/(?:abs\/|full\/)?|[?&]id=)(10\.\d{4,9}\/[^\s?#&]+)/iu.exec(url);
  if (doi !== null) {
    return { id: decodeURIComponent(doi[1]).toLowerCase(), kind: "doi" };
  }

  return null;
}

export function citationKey(identifier: CitationIdentifier): string {
  return `${identifier.kind}:${identifier.id}`;
}

export function normalizeCitationText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/gu, "")
    .replace(/<[^>]+>/gu, " ")
    .toLowerCase()
    .replaceAll("&", " and ")
    .replace(/[^a-z0-9]+/gu, " ")
    .trim();
}

function titleCandidates(title: string): readonly string[] {
  const full = normalizeCitationText(title);
  const mainTitle = /^(.+?)[:?.]\s/u.exec(title.trim());
  return mainTitle === null
    ? [full]
    : [full, normalizeCitationText(mainTitle[1])];
}

/**
 * PubMed full names can carry a subtitle or translated names after " : " or
 * ". " ("Applied acoustics. Acoustique applique. Angewandte Akustik"), and a
 * parenthetical place ("Medicine (Baltimore)").
 */
function journalCandidates(journal: string): readonly string[] {
  const withoutQualifier = journal
    .replace(/\s*\([^)]*\)\s*/gu, " ")
    .split(/\s:\s/u)[0];
  const firstSegment = withoutQualifier.split(/\.\s/u)[0];
  const names = [journal, withoutQualifier, firstSegment].map((name) =>
    normalizeCitationText(name).replace(/^the /u, ""));
  return [...new Set(names.flatMap((name) => [name, ...(JOURNAL_ALIASES[name] ?? [])]))];
}

/**
 * Registry publications may add a parenthetical label, such as
 * "bioRxiv (preprint)"; the label is not part of the journal name.
 */
function registryPublication(publication: string): string {
  return normalizeCitationText(publication.replace(/\s*\([^)]*\)\s*/gu, " "))
    .replace(/^the /u, "");
}

export function citationMismatches(
  source: Pick<ResearchSource, "publication" | "title" | "year">,
  record: CitationRecord,
): readonly CitationMismatch[] {
  const mismatches: CitationMismatch[] = [];

  if (!titleCandidates(record.title).includes(normalizeCitationText(source.title))) {
    mismatches.push({ expected: record.title, field: "title", found: source.title });
  }

  const publication = registryPublication(source.publication);
  const journalMatches = record.journals.some((journal) =>
    journalCandidates(journal).includes(publication));
  const preprintLabelMatches = record.preprint === /preprint/iu.test(source.publication);
  if (!journalMatches || !preprintLabelMatches) {
    mismatches.push({
      expected: record.preprint
        ? `${record.journals[0] ?? "preprint server"} (preprint)`
        : record.journals.join(" / "),
      field: "publication",
      found: source.publication,
    });
  }

  if (!record.years.includes(source.year)) {
    mismatches.push({
      expected: record.years.join(" or "),
      field: "year",
      found: String(source.year),
    });
  }

  return mismatches;
}
