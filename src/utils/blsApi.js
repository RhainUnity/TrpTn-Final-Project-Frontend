// src/utils/blsApi.js

const BLS_URL = "https://api.bls.gov/publicAPI/v2/timeseries/data/";

export async function fetchBlsSeries(seriesId) {
  const res = await fetch(BLS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      seriesid: [seriesId],
      // optional: startyear/endyear
    }),
  });

  if (!res.ok) throw new Error(`BLS request failed: ${res.status}`);

  const data = await res.json();
  const series = data?.Results?.series?.[0];
  const latest = series?.data?.[0]; // usually most recent is first

  if (!latest) return null;

  return {
    seriesId,
    value: Number(latest.value),
    year: latest.year,
    periodName: latest.periodName,
  };
}
