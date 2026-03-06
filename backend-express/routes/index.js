// routes/index.js - Main Express router

const router = require("express").Router();
const userRoutes = require("./users");

router.get("/ping", (req, res) => {
  res.send({ message: "pong" });
});

router.use(userRoutes);

module.exports = router;
