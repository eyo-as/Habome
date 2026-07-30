const express = require("express");
const router = express.Router();
const {
  getAllProperties,
  getAllUsers,
  disableProperty,
  getMetrics,
} = require("../controllers/adminController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.use(authenticateToken);
router.use(authorizeRoles("admin"));

router.get("/properties", getAllProperties);
router.get("/users", getAllUsers);
router.patch("/properties/:id/disable", disableProperty);
router.get("/metrics", getMetrics);

module.exports = router;
