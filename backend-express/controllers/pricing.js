const { resolveSeriesId } = require("../utils/blsSeriesMap");
const { fetchBlsSeries } = require("../utils/blsApi");

async function getAveragePrice(req, res, next) {
  try {
    const { query } = req.query;

    if (!query || !query.trim()) {
      return res.status(400).send({ message: "Query is required" });
    }

    const match = resolveSeriesId(query);

    if (!match) {
      return res.status(404).send({ message: "No BLS mapping found for item" });
    }

    const blsData = await fetchBlsSeries(match.seriesId);

    return res.send({
      item: match.key,
      seriesId: match.seriesId,
      unit: match.unit,
      ...blsData,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getAveragePrice,
};