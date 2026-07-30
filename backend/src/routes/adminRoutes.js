const express = require("express");
const router = express.Router();
const {
  getAllProperties,
  getAllUsers,
  disableProperty,
  deleteProperty,
  deleteUser,
  getMetrics,
} = require("../controllers/adminController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.use(authenticateToken);
router.use(authorizeRoles("admin"));

router.get("/properties", getAllProperties);
router.get("/users", getAllUsers);
router.patch("/properties/:id/disable", disableProperty);
router.delete("/properties/:id", deleteProperty);
router.delete("/users/:id", deleteUser);
router.get("/metrics", getMetrics);

module.exports = router;
