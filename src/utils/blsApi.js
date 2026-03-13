// src/utils/blsApi.js

//  ///// did not work because of CORS(lacking), but keeping as reference for when I do backend integration /////
/* const BLS_URL = "https://api.bls.gov/publicAPI/v2/timeseries/data/"; */
// in stage 2: Express backend > calls BLS > returns JSON
// HAD TO INCORPORATE CORS PROXY TO BYPASS LACK OF SERVER/BACKEND

// const BLS_URL = "https://api.bls.gov/publicAPI/v2/timeseries/data/";

// export async function fetchBlsSeries(seriesId) {
//   const proxy = "https://corsproxy.io/?"; // HAD TO INCORPORATE CORS PROXY TO BYPASS LACK OF SERVER/BACKEND
//   const target = encodeURIComponent(BLS_URL);

//   const res = await fetch(proxy + target, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       seriesid: [seriesId],
//     }),
//   });

//   if (!res.ok) {
//     throw new Error(`BLS request failed: ${res.status}`);
//   }

//   const data = await res.json();
//   const series = data?.Results?.series?.[0];
//   const latest = series?.data?.[0];

//   if (!latest) return null;

//   return {
//     seriesId,
//     value: Number(latest.value),
//     year: latest.year,
//     periodName: latest.periodName,
//   };
// }
