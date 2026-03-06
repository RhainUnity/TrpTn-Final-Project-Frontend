// index.js - Main API router

const router = require("express").Router();
const userRoutes = require("./users");
const itemRoutes = require("./items");

router.get("/ping", (req, res) => {
  res.send({ message: "pong" });
});

router.use(userRoutes);
router.use(itemRoutes);

module.exports = router;
