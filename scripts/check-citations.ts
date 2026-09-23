/**
 * Resolves every PubMed, PMC, and DOI source in the research registry and
 * compares the recorded title, journal, and year with the linked record.
 *
 *   bun run check:citations           check the registry against live records
 *   bun run check:citations --write   also refresh app/research/citation-records.json
 *
 * The offline test in app/research/citations.test.ts checks the registry
 * against the committed snapshot, so CI does not need network access. Run
 * this script with --write whenever you add or change a source.
 */
import { RESEARCH_SOURCES } from "../app/research/articles";
import {
  citationIdentifier,
  citationKey,
  citationMismatches,
  type CitationIdentifier,
  type CitationRecord,
} from "../app/research/citations";

const SNAPSHOT_PATH = new URL("../app/research/citation-records.json", import.meta.url);
const USER_AGENT = "sleepyland-citation-check (+https://github.com/hraness/sleepyland)";
const EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi";
const PREPRINT_SERVER = /\b(?:biorxiv|medrxiv|arxiv|research square|preprints|ssrn|psyarxiv)\b/iu;
const write = process.argv.includes("--write");

type JsonObject = Record<string, unknown>;

async function getJson(url: string): Promise<JsonObject> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
      if (response.ok) return await response.json() as JsonObject;
      lastError = new Error(`HTTP ${response.status} for ${url}`);
      if (response.status === 404) break;
    } catch (error) {
      lastError = error;
    }
    await Bun.sleep(1_000 * (attempt + 1));
  }
  throw lastError;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function yearsFrom(...values: unknown[]): number[] {
  const years = values.flatMap((value) => {
    const match = /\b(1[89]\d\d|20\d\d)\b/u.exec(text(value));
    return match === null ? [] : [Number(match[1])];
  });
  return [...new Set(years)].toSorted();
}

function eutilsRecord(entry: JsonObject): CitationRecord {
  const journals = [text(entry.fulljournalname), text(entry.source)].filter(Boolean);
  const pubTypes = Array.isArray(entry.pubtype) ? entry.pubtype.map(text) : [];
  return {
    journals: [...new Set(journals)],
    preprint: pubTypes.includes("Preprint") || journals.some((name) => PREPRINT_SERVER.test(name)),
    title: text(entry.title).replace(/\.$/u, ""),
    years: yearsFrom(entry.pubdate, entry.epubdate, entry.printpubdate),
  };
}

async function resolveEutils(
  database: "pmc" | "pubmed",
  ids: readonly string[],
): Promise<Map<string, CitationRecord>> {
  const records = new Map<string, CitationRecord>();
  for (let start = 0; start < ids.length; start += 100) {
    const batch = ids.slice(start, start + 100);
    const numericIds = batch.map((id) => id.replace(/^PMC/u, ""));
    const body = await getJson(
      `${EUTILS}?db=${database}&retmode=json&id=${numericIds.join(",")}`,
    );
    const result = (body.result ?? {}) as Record<string, JsonObject>;
    batch.forEach((id, index) => {
      const entry = result[numericIds[index]];
      if (entry !== undefined && entry.error === undefined) {
        records.set(id, eutilsRecord(entry));
      }
    });
    await Bun.sleep(400);
  }
  return records;
}

function crossrefYears(message: JsonObject): number[] {
  return [...new Set(["issued", "published-print", "published-online", "posted"].flatMap((field) => {
    const dateParts = (message[field] as { "date-parts"?: unknown[][] } | undefined)?.["date-parts"];
    const year = dateParts?.[0]?.[0];
    return typeof year === "number" ? [year] : [];
  }))].toSorted();
}

async function resolveDoi(doi: string): Promise<CitationRecord | undefined> {
  const body = await getJson(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
  const message = body.message as JsonObject | undefined;
  if (message === undefined) return undefined;
  const list = (value: unknown) => Array.isArray(value) ? value.map(text).filter(Boolean) : [];
  const institutions = Array.isArray(message.institution)
    ? message.institution.map((entry) => text((entry as JsonObject).name)).filter(Boolean)
    : [];
  const journals = [
    ...list(message["container-title"]),
    ...list(message["short-container-title"]),
    ...institutions,
  ];
  return {
    journals: [...new Set(journals)],
    preprint: message.type === "posted-content" || journals.some((name) => PREPRINT_SERVER.test(name)),
    title: list(message.title)[0] ?? "",
    years: crossrefYears(message),
  };
}

const sources = Object.entries(RESEARCH_SOURCES).flatMap(([sourceId, source]) => {
  const identifier = citationIdentifier(source.url);
  return identifier === null ? [] : [{ identifier, source, sourceId }];
});
const skipped = Object.keys(RESEARCH_SOURCES).length - sources.length;
const byKind = (kind: CitationIdentifier["kind"]) => [
  ...new Set(sources.filter((entry) => entry.identifier.kind === kind).map((entry) => entry.identifier.id)),
];

const resolved = new Map<string, CitationRecord>();
for (const [id, record] of await resolveEutils("pubmed", byKind("pmid"))) {
  resolved.set(citationKey({ id, kind: "pmid" }), record);
}
for (const [id, record] of await resolveEutils("pmc", byKind("pmcid"))) {
  resolved.set(citationKey({ id, kind: "pmcid" }), record);
}
for (const doi of byKind("doi")) {
  const record = await resolveDoi(doi);
  if (record !== undefined) resolved.set(citationKey({ id: doi, kind: "doi" }), record);
  await Bun.sleep(200);
}

const failures: string[] = [];
for (const { identifier, source, sourceId } of sources) {
  const key = citationKey(identifier);
  const record = resolved.get(key);
  if (record === undefined) {
    failures.push(`${sourceId}: ${key} did not resolve (${source.url})`);
    continue;
  }
  for (const mismatch of citationMismatches(source, record)) {
    failures.push(
      `${sourceId}: ${mismatch.field} is "${mismatch.found}", but ${key} has "${mismatch.expected}"`,
    );
  }
}

const snapshot = Object.fromEntries(
  [...resolved.entries()].toSorted(([left], [right]) => left.localeCompare(right)),
);
const serialized = `${JSON.stringify(snapshot, null, 2)}\n`;
const committed = await Bun.file(SNAPSHOT_PATH).text().catch(() => "");

if (write) {
  await Bun.write(SNAPSHOT_PATH, serialized);
  console.log(`Wrote ${resolved.size} records to app/research/citation-records.json.`);
} else if (committed !== serialized) {
  failures.push("app/research/citation-records.json differs from the live records. Run `bun run check:citations --write` and review the diff.");
}

console.log(
  `Checked ${sources.length} PubMed, PMC, and DOI sources; ${skipped} other sources have no bibliographic identifier and were not checked.`,
);

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Every checked source matches its linked record.");
