const router = require("express").Router();
const { getAveragePrice } = require("../controllers/pricing");

router.get("/average-price", getAveragePrice);

module.exports = router;