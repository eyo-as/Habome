const { uploadImages: buildUploadUrls } = require("../services/uploadService");

const uploadImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, error: "No files uploaded" });
  }

  const urls = buildUploadUrls(req.files);
  res.status(200).json({ success: true, data: { urls } });
};

module.exports = { uploadImages };
