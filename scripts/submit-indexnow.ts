import { parseOwnedPath } from "@hraness/web-discovery";

import {
  INDEX_NOW_KEY,
  indexNowPayload,
} from "../app/search-discovery";

const INDEX_NOW_ENDPOINT =
  process.env.INDEX_NOW_ENDPOINT ?? "https://api.indexnow.org/indexnow";
const requestedPaths = process.argv
  .slice(2)
  .filter((argument) => argument !== "--")
  .map(parseOwnedPath);
const payload = indexNowPayload(
  requestedPaths.length === 0 ? undefined : requestedPaths,
);

const keyResponse = await fetch(payload.keyLocation);

if (!keyResponse.ok || (await keyResponse.text()).trim() !== INDEX_NOW_KEY) {
  throw new Error(
    `IndexNow key is not deployed at ${payload.keyLocation}.`,
  );
}

const response = await fetch(INDEX_NOW_ENDPOINT, {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  body: JSON.stringify(payload),
});

if (response.status !== 200 && response.status !== 202) {
  throw new Error(
    `IndexNow rejected ${payload.urlList.length} URLs with HTTP ${response.status}: ${await response.text()}`,
  );
}

console.log(
  `IndexNow accepted ${payload.urlList.length} Sleepyland URLs with HTTP ${response.status}.`,
);
