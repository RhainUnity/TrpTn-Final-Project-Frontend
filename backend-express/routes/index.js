// index.js - Express router for basic routes

const router = require("express").Router();

router.get("/ping", (req, res) => {
  res.send({ message: "pong" });
});

module.exports = router;
