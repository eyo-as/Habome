const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getOwnerMessages,
} = require("../controllers/contactController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.post(
  "/:propertyId",
  authenticateToken,
  authorizeRoles("user"),
  sendMessage,
);
router.get(
  "/inbox",
  authenticateToken,
  authorizeRoles("owner"),
  getOwnerMessages,
);

module.exports = router;
