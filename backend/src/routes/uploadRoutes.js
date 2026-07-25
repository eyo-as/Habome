const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");
const { uploadImages } = require("../controllers/uploadController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.post(
  "/",
  authenticateToken,
  authorizeRoles("owner"),
  upload.array("images", 10),
  uploadImages,
);

module.exports = router;
