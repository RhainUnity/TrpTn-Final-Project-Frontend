// src/utils/blsSeriesMap.js

export const BLS_SERIES_MAP = {
  // example placeholders; verify the exact IDs  //
  banana: "APU0000711211",
  milk: "APU0000709112",
  eggs: "APU0000708111",
  bread: "APU0000702111",
  rice: "APU0000701312",
  chicken: "APU0000FF1101",
};

export function resolveSeriesId(query) {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  // direct key hit
  if (BLS_SERIES_MAP[q]) return { key: q, seriesId: BLS_SERIES_MAP[q] };

  // keyword match
  const keys = Object.keys(BLS_SERIES_MAP);
  const match = keys.find((key) => q.includes(key));
  if (!match) return null;

  return { key: match, seriesId: BLS_SERIES_MAP[match] };
}
