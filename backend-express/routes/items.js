// routes/items.js - Protected routes for shopping items

const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getItems, createItem, deleteItem } = require("../controllers/items");

router.get("/items", auth, getItems);
router.post("/items", auth, createItem);
router.delete("/items/:itemId", auth, deleteItem);

module.exports = router;
