// src/utils/blsSeriesMap.js

export const BLS_SERIES_MAP = {
  // STARTER LIST--MORE TO ADD LATER //
  banana: { seriesId: "APU0000711211", unit: "per lb" },
  milk: { seriesId: "APU0000709112", unit: "per gal" },
  eggs: { seriesId: "APU0000708111", unit: "per dozen" },
  bread: { seriesId: "APU0000702111", unit: "each" },
  rice: { seriesId: "APU0000701312", unit: "per lb" },
  chicken: { seriesId: "APU0000FF1101", unit: "per lb" },
};

export function resolveSeriesId(query) {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  // direct key hit
  if (BLS_SERIES_MAP[q]) return { key: q, ...BLS_SERIES_MAP[q] };

  // keyword match
  const keys = Object.keys(BLS_SERIES_MAP);
  const match = keys.find((key) => q.includes(key));
  if (!match) return null;

  return { key: match, ...BLS_SERIES_MAP[match] };
}
