const express = require("express");
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/favoriteController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.use(authenticateToken, authorizeRoles("user"));

router.get("/", getFavorites);
router.post("/:propertyId", addFavorite);
router.delete("/:propertyId", removeFavorite);

module.exports = router;
