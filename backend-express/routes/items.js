// routes/items.js - Protected routes for shopping items

const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getItems, createItem, deleteItem } = require("../controllers/items");
const {
  validateCreateItem,
  validateItemId,
} = require("../middlewares/validation");

router.get("/items", auth, getItems);
router.post("/items", auth, validateCreateItem, createItem);
router.delete("/items/:itemId", auth, validateItemId, deleteItem);

module.exports = router;
