const express = require("express");
const router = express.Router();
const {
  createPropertyController,
  getPropertiesController,
  getPropertyByIdController,
  getOwnerPropertiesController,
  updatePropertyController,
  publishPropertyController,
  archivePropertyController,
  deletePropertyController,
} = require("../controllers/propertyController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get("/", getPropertiesController);
router.get("/:id", getPropertyByIdController);

router.use(authenticateToken, authorizeRoles("owner"));
router.post("/", createPropertyController);
router.get("/my/listings", getOwnerPropertiesController);
router.put("/:id", updatePropertyController);
router.patch("/:id/publish", publishPropertyController);
router.patch("/:id/archive", archivePropertyController);
router.delete("/:id", deletePropertyController);

module.exports = router;
