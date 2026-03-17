// backend-express/utils/blsApi.js

async function fetchBlsSeries(seriesId) {
  const payload = {
    seriesid: [seriesId],
  };

  if (process.env.BLS_API_KEY) {
    payload.registrationkey = process.env.BLS_API_KEY;
  }

  const response = await fetch(
    "https://api.bls.gov/publicAPI/v2/timeseries/data/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error(`BLS request failed with status ${response.status}`);
  }

  const data = await response.json();

  if (data?.status !== "REQUEST_SUCCEEDED") {
    console.error("BLS non-success response:", JSON.stringify(data, null, 2));
    throw new Error("BLS API request did not succeed");
  }

  const series = data?.Results?.series?.[0];
  const latest = series?.data?.[0];

  if (!latest) {
    console.error(
      "BLS raw response with no latest data:",
      JSON.stringify(data, null, 2),
    );
    throw new Error("No BLS data found");
  }

  return {
    price: Number(latest.value),
    month: latest.periodName,
    year: latest.year,
  };
}

module.exports = { fetchBlsSeries };

/* ------------ BEFORE EDITS (for reference) ------------ */

// async function fetchBlsSeries(seriesId) {
//   const response = await fetch(
//     "https://api.bls.gov/publicAPI/v2/timeseries/data/",
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         seriesid: [seriesId],
//         registrationkey: process.env.BLS_API_KEY,
//       }),
//     },
//   );

//   if (!response.ok) {
//     throw new Error(`BLS request failed with status ${response.status}`);
//   }

//   const data = await response.json();

//   const series = data?.Results?.series?.[0];
//   const latest = series?.data?.[0];

//   if (!latest) {
//     throw new Error("No BLS data found");
//   }

//   return {
//     price: Number(latest.value),
//     month: latest.periodName,
//     year: latest.year,
//   };
// }

// module.exports = { fetchBlsSeries };
