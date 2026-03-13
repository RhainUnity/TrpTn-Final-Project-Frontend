// routes/users.js - User routes

const router = require("express").Router();
const { createUser, login, getCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateSignup, validateSignin } = require("../middlewares/validation");

router.post("/signup", validateSignup, createUser);
router.post("/signin", validateSignin, login);
router.get("/me", auth, getCurrentUser);

module.exports = router;
